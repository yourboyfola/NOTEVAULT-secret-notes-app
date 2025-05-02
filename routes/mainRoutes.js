import bodyParser from "body-parser";
import mongoose from 'mongoose';
import newUser from "../models/usermodel.js";
import bcrypt from 'bcrypt';
import Note from "../models/mainmodel.js";
import secretNote from "../models/secretmodel.js";

console.log("Attempting to connect to MongoDB...");
mongoose.connect('mongodb://localhost:27017/notesDB')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

const newNote = async (req, res) => {
    const allNotes = await Note.find();
    const {author, title, body} = req.body;
    const newNote = new Note ({
        author,
        title,
        body
    });
    await newNote.save();
    res.redirect('/notes');
};

const login = async (req, res) => {
    const {username, password} = req.body;
    const user = await newUser.findOne({username});
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
        req.session.userId = user._id;
        res.redirect('/notes')
    } else {
        res.send('Error. Invalid Credentials');
    }
};

const signup = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.send("All fields are required.");
      }

    const hashedPassword = await bcrypt.hash(password, 10);  

    const existingUser = await newUser.findOne({username});
    if (existingUser) {
        return res.send('User already Exists');
        res.redirect('/login');
    }
    const user = new newUser({
        username,
        password: hashedPassword
    })
    await user.save();
    res.redirect('/login');

};

const notes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.render('notes', { notes, session: req.session });
    } catch (error) {
        res.status(500).send("Error fetching notes");
    }
};

const secrets = async (req, res) => {
    try {
        const totalSecrets = await secretNote.find();
        res.render('secret', {totalSecrets, session: req.session });
    } catch (error) {
        res.status(500).send("Error fetching secret notes");
    }
};

const newSecret = async (req, res) => {
    const allSecrets = await secretNote.find();
    const {title, body} = req.body;
    const newSecret = new secretNote ({
        title,
        body
    });
    await newSecret.save();
    res.render('secretKeyPage', { secretId: newSecret._id });
    //res.redirect('/secretKeyPage');
};

const viewSecrets = async (req, res) => {
    const key = req.body.key;

    if (!mongoose.Types.ObjectId.isValid(key)) {
        return res.send("Invalid secret key format.");
    }

    const note = await secretNote.findById(key);
    res.render('viewSecret', { note, session: req.session });
};

const insertCodeForSecret = (req, res) => {
    res.render('secretViewInput');
};

const logout = async (req, res) => {
   await req.session.destroy();
   res.redirect('login');
};

export function main(app) {

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use((req, res, next) => {
        res.locals.session = req.session;
        next();
    }); 

    app.get('/signup', (req, res) => {
        res.render('signup');
    });

    app.post('/signup', signup);

    app.get(['/','/login'], (req, res) => {
        res.render('login');
    });

    app.post('/login', login);

    app.get('/newnote', async (req, res) => {
        res.render('newnote');
    });

    app.post('/newnote', newNote)

    app.get('/notes', notes);
    
    app.get('/secret', secrets);

    app.get('/secret/new', (req, res) => {
        res.render('newSecret');
     });

    app.post('/secret/new', newSecret);

    app.post('/secret/view', viewSecrets);

    app.get('/secretViewInput', insertCodeForSecret);
    app.get('/logout', logout);
};
