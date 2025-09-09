const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require('cors');

const app = express();
const port=process.env.port || 3001;

app.use(express.json());
//Création de la connection à la base de données
const connect=mongoose.connect("mongodb+srv://hamadiay:HAAY2024@mabase.izktzbl.mongodb.net/?retryWrites=true&w=majority&appName=maBase");

  connect.then(
    (db) => {
      console.log("Connected Successfully to Mongodb Server");
  
    },
    (err) => {
      console.log(err);
    }
  );

app.listen(port, () => {
  console.log("Server is running...");
});


//  Le CORS permet de prendre en charge des requêtes multi-origines sécurisées.
app.use(cors());
//Ajout de json pour echanger des données JSON par les requettes (req,res)
app.use(express.json());

const ProductSchema = new mongoose.Schema({
  _id: {type:String, required:true},
  title: {type:String, required:true},
  price: {type:Number, required:true},
  description: {type:String, required:true},
  category: {type:String, required:true},
  image: {type:String, required:true},
  rate: {type:String, },
  count: {type:Number, required:true},
  sales: {type:String, required:true},
  percsales: {type:Number,},
  taille: {type:String,},
  pointure: {type:Number,},
  ref: {type:String, required:true},
});
ProductSchema.set('versionKey', false);
//product : c'est le nom du model
const product = mongoose.model('productsLaCollection', ProductSchema, 'productsLaCollection');

app.get("/findallproducts", async (request, response) => {
  //product : c'est le nom du model
    const products = await product.find({});
    try {
      response.status(200).json(products);
      //console.log(products);
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  });
//Ajouter un produit

app.post("/ajouternouveauprod", async (request, response) => {
  const produit = new product(request.body);
  try {
    //console.log(produit);
    await produit.save();
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
    
  }
});

//Supprimer un produit
app.delete("/supprimerproduit/:_id", async (request, response) => {
  //product : c'est le nom du model
   await product.findByIdAndDelete(request.params._id);
  //console.log(product);
  try {
    response.status(200).send();
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

//Mise à jour d'un produit
app.patch("/updateprod", async (request, response) => {
  const newproduct ={
    title: request.body.title,
    price: request.body.price,
    description: request.body.description,
    category: request.body.category,
    image: request.body.image,
    rate: request.body.rate,
    count: request.body.count,
    sales: request.body.sales,
    percsales: request.body.percsales,
    taille: request.body.taille,
    pointure: request.body.pointure,
    ref: request.body.ref,
  };
    //console.log(request.body._id);
    //console.log(newproduct);
    try {
      //product : c'est le nom du model
      await product.findByIdAndUpdate(request.body._id, newproduct);
      //await prod.save();
      response.status(200).send(newproduct);
    } catch (error) {
      response.status(500).send(error);
    }
  });


const UserSchema = new mongoose.Schema({
    _id: {type:String, required:false},
    prenom: {type:String, required:true},
    nom: {type:String, required:true},
    tel: {type:String, required:true},
    adremail: {type:String, required:true},
    motpasse: {type:String, required:true},
    newsletter: {type:String, required:false},
    enligne: {type:String, required:false},
    titre: {type:String, required:true},
});
UserSchema.set('versionKey', false);
//user : c'est le nom du model
const user = mongoose.model('usersLaCollection', UserSchema, 'usersLaCollection');
//user.createCollection();

//Récupérer tous les users

app.get("/findall", async (request, response) => {
    //user : c'est le nom du model
      const users = await user.find({});
      try {
        response.status(200).json(users);
      } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
      }
    });

//Ajouter un user

app.post("/ajouter", async (request, response) => {
    const utilisateur = new user(request.body);
    
    try {
      //console.log(utilisateur);
      await utilisateur.save();
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
      //console.log(utilisateur);
    }
  });

  const contactEmail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hammadi.ayaridev@gmail.com",
      pass: "aormitvngnxyzbdz",
    },
    
  });
  
  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });
  
  app.post("/codeconfirminsc", (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
    //console.log(req.body);
    const mail = {
      from: "Boutique LA COLLECTION",
      to: "hamadi.ay@gmail.com",
      subject: "Contact Boutique Form LA COLLECTION: Code de confirmation d'inscription",
      html: `
              <p>Message: ${message}</p>
          `,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "ERROR" });
      } else {
        res.json({ status: "Message Sent" });
      }
    });
  });
 
  app.post("/coderecup", (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
    const mail = {
      from: "Boutique LA COLLECTION",
      to: "hamadi.ay@gmail.com",
      subject: "Contact Boutique Form LA COLLECTION: Code de validation récupération compte",
      html: `
              <p>Email: ${email}</p>
              <p>Message: ${message}</p>
          `,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "ERROR" });
      } else {
        res.json({ status: "Message Sent" });
      }
    });
  });

  //Répondre client par e-mail
  app.post("/reponsemsgclient", (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
    //console.log(req);
    const mail = {
      from: "Boutique LA COLLECTION",
      to: "hamadi.ay@gmail.com",
      subject: req.body.objet,
      html: `
              <p>Email: ${email}</p>
              <p>Message: ${message}</p>
          `,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "ERROR" });
      } else {
        res.json({ status: "Message Sent" });
      }
    });
  });
  
  //Mise à jour d'un user
  app.patch("/updateuser", async (request, response) => {
    const newuser ={
      prenom: request.body.prenom,
      nom: request.body.nom,
      tel: request.body.tel, 
      adremail: request.body.adremail,
      motpasse: request.body.motpasse,
      newsletter: request.body.newsletter,
      enligne: request.body.enligne,
      titre: request.body.titre,
    };
      //console.log(request.body._id);
      //console.log(newuser);
      try {
        await user.findByIdAndUpdate(request.body._id, newuser);
        //await prod.save();
        response.status(200).send(newuser);
      } catch (error) {
        response.status(500).send(error);
      }
    });

//Supprimer un client
app.delete("/supprimerclient/:_id", async (request, response) => {
  //user : c'est le nom du model
   await user.findByIdAndDelete(request.params._id);
  //console.log(product);
  try {
    response.status(200).send();
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});



//Gestion admin
const AdminSchema = new mongoose.Schema({
  _id: {type:String, required:true},
  login: {type:String, required:true},
  motpasse: {type:String, required:true},

});
AdminSchema.set('versionKey', false);
//admin : c'est le nom du model
const admin = mongoose.model('adminLaCollection', AdminSchema, 'adminLaCollection');
  
//Récupérer login admin
app.get("/findadmin", async (request, response) => {
  //admin : c'est le nom du model
    const admins = await admin.find({});
    
    try {
      response.status(200).json(admins);
      //console.log(admins);
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  });

  
  //Mise à jour Admin 
app.patch("/updateadmincompte", async (request, response) => {
const newadmin ={
  login: request.body.login,
  motpasse: request.body.motpasse,
};
  //console.log(request.body._id);
  //console.log(newadmin);
  try {
    //admin : c'est le nom du model
    await admin.findByIdAndUpdate('1', newadmin);
    response.status(200).send(newadmin);
  } catch (error) {
    response.status(500).send(error);
  }
});


//GESTION MESSAGES
const MessageSchema = new mongoose.Schema({
  _id: {type:String, required:false},
  titre: {type:String, required:true},
  prenom: {type:String, required:true},
  nom: {type:String, required:true},
  tel: {type:String, required:true},
  adremail: {type:String, required:true},
  message: {type:String, required:true},
  date: {type:String, required:true}
});
MessageSchema.set('versionKey', false);
//message : c'est le nom du model
const modmessage = mongoose.model('messagesLaCollection', MessageSchema, 'messagesLaCollection');

//Ajouter un message

app.post("/ajoutermessage", async (request, response) => {
  const msg = new modmessage(request.body);
  
  try {
    //console.log(msg);
    await msg.save();
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
    //console.log(msg);
  }
});


//Récupérer tous les messages

app.get("/findallmessages", async (request, response) => {
  //msg : c'est le nom du model
    const msgs = await modmessage.find({});
    try {
      response.status(200).json(msgs);
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  });

  //Supprimer un message
app.delete("/supprimermessage/:_id", async (request, response) => {
  //modmessage : c'est le nom du model
   await modmessage.findByIdAndDelete(request.params._id);
  try {
    response.status(200).send();
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});