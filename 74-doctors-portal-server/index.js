const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4nt1ond.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJWT = (req, res, next) =>{
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send("Unauthorized Access")
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function(error, decoded){
    if(error){
      return res.status(403).send({message : "Forbidden User"});
    }
    req.decoded = decoded;
    next();
  })
}

async function run(){
  try{
    const appointmentOptionsCollections = client
      .db("doctorsPortal")
      .collection("appointmentOptions");

    const bookingsCollection = client
      .db("doctorsPortal")
      .collection("bookings");

    const usersCollection = client
      .db("doctorsPortal")
      .collection("users");

    const doctorsCollection = client
      .db("doctorsPortal")
      .collection("doctors");

    // Note: Make Sure You user verifyAdmin after verifyJWT----------------------------------------->>>>>>>>>>>>>>>>>.  
    const verifyAdmin = async(req, res, next) =>{
      // console.log(`InSide Verify Email ${req.decoded.email}`);
       const decodedEmail = req.decoded.email;
         const query = { email: decodedEmail };
         const user = await usersCollection.findOne(query);

         if (user?.role !== "admin") {
           return res.status(403).send({ message: "forbidden access" });
         }
      next()
    }


    // Use Aggregate to query multiple collection and then merge data
    app.get("/appointmentOptions", async (req, res) => {
      const date = req.query.date;
      // console.log(date);
      const query = {};
      const options = await appointmentOptionsCollections.find(query).toArray();

      // Get the bookings of the provided date.......................>
      const bookingQuery = { appointmentDate: date };
      const alreadyBooked = await bookingsCollection
        .find(bookingQuery)
        .toArray();
        // console.log(alreadyBooked)

      // Code Read Carefully......................>
      options.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.treatment === option.name
        );
        const bookedSlots = optionBooked.map((book) => book.slot);

        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        // console.log( date, option.name,remainingSlots.length)
        option.slots = remainingSlots;
        //  console.log(remainingSlots);
      });
      res.send(options);
    });

    /* Fully Optional ------>Same Work on Above --------------> 74.7 video------------>

     app.get('/v2/appointmentOptions', async (req, res) => {
            const date = req.query.date;
            const options = await appointmentOptionCollection.aggregate([
                {
                    $lookup: {
                        from: 'bookings',
                        localField: 'name',
                        foreignField: 'treatment',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$appointmentDate', date]
                                    }
                                }
                            }
                        ],
                        as: 'booked'
                    }
                },
                {
                    $project: {
                        name: 1,
                        slots: 1,
                        booked: {
                            $map: {
                                input: '$booked',
                                as: 'book',
                                in: '$$book.slot'
                            }
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        slots: {
                            $setDifference: ['$slots', '$booked']
                        }
                    }
                }
            ]).toArray();
            res.send(options);
        })
    */
    /*
     * API Naming Convention
     * app.get("bookings")
     * app.get("bookings/:id")
     * app.post("bookings")
     * app.put/patch("bookings/:id")
     * app.delete("bookings/:id")
     */

    app.get("/bookings", verifyJWT, async(req, res)=>{
      const email = req.query.email;
      console.log(email)
      const decodedEmail = req.decoded.email;
      if(email !== decodedEmail){
        return res.status(403).send({message: "Forbidden Access"})
      }
      
      const query = { email : email};
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    })

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      
      const query = {
        email : booking.email,
        appointmentDate : booking.appointmentDate,
        treatment : booking.treatment
      }
      const alreadyBooked = await bookingsCollection.find(query).toArray();
      if(alreadyBooked.length){
        const message = `You Already have a booking on ${booking.appointmentDate}`;
        return res.send({acknowledged: false, message})
      }

      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // JWT First Part-------------------------------------------------------------------------->>>>>>>>>>
    app.get("/jwt", async(req, res)=>{
      const email = req.query.email;
      const query = {email : email};
      const user = await usersCollection.findOne(query);
      if(user){
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {expiresIn: "5h"});
        return res.send({accessToken: token})
      }
      res.status(403).send({accessToken: ''})
      // console.log(user)
    })

    app.get("/users", async(req, res)=>{
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    })

    app.get("/users/admin/:email", async(req, res)=>{
      const email = req.params.email;
      const query = {email}
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    })

    app.post("/users", async(req, res)=>{
      const user = req.body;
      const result = await  usersCollection.insertOne(user);
      res.send(result);
    })

       app.put("/users/admin/:id", verifyJWT, verifyAdmin, async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updatedDoc = {
           $set: {
             role: "admin",
           },
         };
         const result = await usersCollection.updateOne(
           filter,
           updatedDoc,
           options
         );
         res.send(result);
       });


       app.get("/appointmentSpecialty", async (req, res) => {
         const query = {};
         const result = await appointmentOptionsCollections
           .find(query)
           .project({ name: 1 })
           .toArray();
         res.send(result);
       });

       app.get("/doctors", verifyJWT, verifyAdmin, async (req, res)=>{
        const query = {};
        const result = await doctorsCollection.find(query).toArray();
        res.send(result);
       })

       app.post("/doctors", verifyJWT, verifyAdmin, async(req, res)=>{
        const doctor = req.body;
        const result = await doctorsCollection.insertOne(doctor);
        res.send(result); 
       })

       app.delete("/doctors/:id", verifyJWT, verifyAdmin, async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await doctorsCollection.deleteOne(query);
        res.send(result);
       })


  // Payment Getaway Start Here----------------------------->>>>>>>>>>>>>>>>>>>>>

  // Temporary to update price field on appointment options--then comment out
  // app.get("/addPrice", async(req, res)=>{
  //   const filter = {};
  //   const options = {upsert: true};
  //   const updatedDoc = {
  //     $set:{
  //       price: 99
  //     }
  //   }
  //   const result = await appointmentOptionsCollections.updateMany(filter, updatedDoc, options);
  //   res.send(result);
  // })

  /* 
  Get Bookings With Id on Payment ---------By using params Loader------->>>>>>>
   */
  app.get("/bookings/:id", async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await bookingsCollection.findOne(query);
    res.send(result);
  })

  // SET up Stripe server --------------------------------->>>>>>>>>>>>>>>>>>
  app.post("/create-payment-intent", async (req, res) => {
    const booking = req.body;
    const price = booking.price;
    const amount = price * 100;

    const paymentIntent = await stripe.paymentIntens.create({
      currency: "usd",
      amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

  // 











  }
  finally{

  }
}
run().catch(e=> console.log(e))

app.get("/", (req, res)=>{
    res.send("Doctor's Portal Server is Running..............")
})

app.listen(port, ()=>{
    console.log(`Your Available Port Is ------>${port}`)
})