const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/qp-app';
const mongoose = require("mongoose");


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Question = require("../models/question");
const Module = require("../models/module");
const Subject = require("../models/subject");

const subModules = [
    {
        title: "Introduction",
        marks: 25
    },
    {
        title: "Basics of Cryptography",
        marks: 30
    },
    {
        title: "Secret Key Cryptography",
        marks: 30
    },
    {
        title: "Authentication Applications",
        marks: 25
    },
    {
        title: "Program Security",
        marks: 40
    },
    {
        title: "IP Security",
        marks: 30
    },
];

const subQuestions = [{
    title: "What are passive attacks ? Categorize these attacks and explain one example of each",
    module: "Introduction"
    },{
    title: "What are active attacks ? Categorize theses attacks and explain one example of each",
    module: "Introduction"
    },{
    title: "Distinguish between attack, vulnerability and access control",
    module: "Introduction"
    },{
    title: "Distinguish between vulnerability, threats and controls	",
    module: "Introduction"
    },{
    title: "What are different security goals ?",
    module: "Introduction"
    },{
    title: "What are the system security goals ? Explain why the balance among different goals is needed",
    module: "Introduction"
    },{
    title: "Define the goals of security and specify mechanisms to achieve goal",
    module: "Introduction"
    },{
    title: "Explain in detail different security mechanisms",
    module: "Introduction"
    },{
    title: "What are the eight security mechnanisms to implement security",
    module: "Introduction"
    },{
    title: "What are the key principles of security",
    module: "Introduction"
    },{
    title: "List various Software Vulnerabilities. How vulnerabilities are exploited to launch an attack",
    module: "Introduction"
    },{
    title: "Explain substitution cipher",
    module: "Basics of Cryptography"
    },{
    title: "Encrpyt 'The key is hidden under the door' using Playfair cipher with keyword 'domestic'",
    module: "Basics of Cryptography"
    },{
    title: "Short Note on Columnar transposition techniques",
    module: "Basics of Cryptography"
    },{
    title: "Short Note on  Keyless transposition techniques",
    module: "Basics of Cryptography"
    },{
    title: "Explain transposition cipher",
    module: "Basics of Cryptography"
    },{
    title: "What is keyless transposition cipher ? Give any example of rail fence cipher",
    module: "Basics of Cryptography"
    },{
    title: "Describe block ciphers ? ",
    module: "Basics of Cryptography"
    },{
    title: "Example with example keyed and keyless transposition cipher",
    module: "Basics of Cryptography"
    },{
    title: "What are tarditional ciphers ? Discuss any one substitution and transposition cipher with example . list their merits and demerits",
    module: "Basics of Cryptography"
    },{
    title: "Explain structure of DES",
    module: "Secret Key Cryptography"
    },{
    title: "Explain any one of block ciphers with example",
    module: "Secret Key Cryptography"
    },{
    title: "Explain working of DES detailing the Fiestel structure",
    module: "Secret Key Cryptography"
    },{
    title: "Write short note on : Multiple DES",
    module: "Secret Key Cryptography"
    },{
    title: "Write in brief about Key generation in IDEA",
    module: "Secret Key Cryptography"
    },{
    title: "What are block cipher algorithmic modes ? Describe any two modes",
    module: "Secret Key Cryptography"
    },{
    title: "Solve : AES",
    module: "Secret Key Cryptography"
    },{
    title: "Compare AES and DES",
    module: "Secret Key Cryptography"
    },{
    title: "Write a short note on RSA algorithm (Public key algortihm)",
    module: "Public Key Cryptography"
    },{
    title: "Explain how a key is shared between two parties using Diffie Hellman key exchange algorithm. What is drawback of this algorithm ? ",
    module: "Public Key Cryptography"
    },{
    title: "Explain cryptographic hash function",
    module: "Cryptographic Hash Function"
    },{
    title: "Explain cryptographic hash function criteria and compare MD5 and SHA-1",
    module: "Cryptographic Hash Function"
    },{
    title: "Short note : MD5",
    module: "Cryptographic Hash Function"
    },{
    title: "What is SHA-1 ? Explain different steps of working of SHA-1 ",
    module: "Cryptographic Hash Function"
    },{
    title: "Compare between MD5 and SHA-1 algorithms",
    module: "Cryptographic Hash Function"
    },{
    title: "Short note - Digital signature",
    module: "Cryptographic Hash Function"
    },{
    title: "Explain different authentication methods and protocols",
    module: "Cryptographic Hash Function"
    },{
    title: "What are the properties of hash function? Explain role of hash function in security",
    module: "Cryptographic Hash Function"
    },{
    title: "Explain the process of Digital Certificate generation and the process of evaluation of authenticity of Digital certificate",
    module: "Authentication Applications"
    },{
    title: "Does a public key infrastructure use symmetric or assymetric encryption ? Explain your answer",
    module: "Authentication Applications"
    },{
    title: "Explain the process of Digital Certificate generation and process of evaluation of authenticity of Digital certificate ",
    module: "Authentication Applications"
    },{
    title: "Short note - Email Security",
    module: "Authentication Applications"
    },{
    title: "How does PGP achieve confidentiality and authentication in emails",
    module: "Authentication Applications"
    },{
    title: "Why digital signature and digital certificates are required ?",
    module: "Authentication Applications"
    },{
    title: "Explain key rings in PGP ?",
    module: "Authentication Applications"
    },{
    title: "Explain non-malicious program errors with example",
    module: "Program Security"
    },{
    title: "What is buffer overflow in software security",
    module: "Program Security"
    },{
    title: "What is incomplete mediation in software security",
    module: "Program Security"
    },{
    title: "What are the different types of malicious code",
    module: "Program Security"
    },{
    title: "Write in brief in - Viruses and their types",
    module: "Program Security"
    },{
    title: "Explain different targeted malicious code",
    module: "Program Security"
    },{
    title: "What is malware",
    module: "Program Security"
    },{
    title: "Explain Salami and linearization attacks",
    module: "Program Security"
    },{
    title: "Write a short note on covert channel",
    module: "Program Security"
    },{
    title: "Write a short note on trojan",
    module: "Program Security"
    },{
    title: "Short note on - various ways of memory and address translation",
    module: "Program Security"
    },{
    title: "Brief - Operating System Security ",
    module: "Program Security"
    },{
    title: "Explain Multiple level security model ",
    module: "Program Security"
    },{
    title: "Explain multilateral security",
    module: "Program Security"
    },{
    title: "What is Bell-La padula ? How Bell-La Padula model works ?",
    module: "Program Security"
    },{
    title: "Differentiate - Firewall and IDS",
    module: "Program Security"
    },{
    title: "What are the strengths and limitations of Intrusion Detection System ?",
    module: "Program Security"
    },{
    title: "Describe the different types of IDS and their limitations",
    module: "Program Security"
    },{
    title: "Write a short note on Firewall",
    module: "Program Security"
    },{
    title: "What are the firewall design principles ?",
    module: "Program Security"
    },{
    title: "List, explain and compare different kinds of firewalls used for network security ",
    module: "Program Security"
    },{
    title: "Explain different typers of firewall ?",
    module: "Program Security"
    },{
    title: "What is personal firewalls ?",
    module: "Program Security"
    },{
    title: "Explain design, configuration and limitations of firewall",
    module: "Program Security"
    },{
    title: "What are different types of firewall ? How firewall is different than IDS ? ",
    module: "Program Security"
    },{
    title: "How does ESP header guarantee confidentiality and integrity for packet payload ? ",
    module: "IP Security"
    },{
    title: "Write a detail note on SSL Protocol ",
    module: "IP Security"
    },{
    title: "Why SSL is needed ? What are the different features SSL provides ? Explain how SSL works ?",
    module: "IP Security"
    },{
    title: "Explain the services of SSL protocol ?",
    module: "IP Security"
    },{
    title: "List the functions of the different protocols of SSL. Explain the handshake protocol",
    module: "IP Security"
    },{
    title: "Solve TLS ",
    module: "IP Security"
    },{
    title: "What is authentication header(AH) ? How does it protect against replay attacks ?",
    module: "IP Security"
    },{
    title: "What is denial of service attack ?",
    module: "IP Security"
    },{
    title: "What is denial of service attack. What are the different ways in which an attacker can mount a DOS attack on a system ? ",
    module: "IP Security"
    },{
    title: "What are the way in which on attack can mount a DOS attack on he system",
    module: "IP Security"
    },{
    title: "Explain methods used to commit session hijack",
    module: "IP Security"
    },{
    title: "Write in brief on IP spoofing",
    module: "IP Security"
    },{
    title: "Write in brief on Buffer overflow attack ",
    module: "IP Security"
    },{
    title: "What is SQL injection ? give example",
    module: "IP Security"
    },{
    title: "Explain different types of Denial of Service attacks",
    module: "IP Security"
    }];    

const seedDB = async function() {
    const sub = new Subject({title: "Cryptography & System Security", maxMarks: 80, totalMarks: 120, semester: 6, branch: "Computer"});
    await sub.save();
    for(let module of subModules) {
        const newModule = new Module(module);
        newModule.subject = sub._id;
        newModule.numOfQuestions = 0;
        sub.modules.push(newModule);
        await newModule.save();
        await sub.save();
    }

    for(let q of subQuestions) {
        const newQuestion = new Question({title: q.title});
        const curModule = await Module.findOne({title: q.module});
        if(curModule) {
            newQuestion.module = curModule._id;
            await newQuestion.save();
            curModule.questions.push(newQuestion);
            await curModule.save();
        }
    }

    console.log("Done");
}


seedDB().then(() => {
    mongoose.connection.close();
})