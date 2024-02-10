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
        title: "Intel 8086/8088 Architetcture",
        marks: 25
    },
    {
        title: "Instruction Set and Programming",
        marks: 30
    },
    {
        title: "System designing with 8086",
        marks: 30
    },
    {
        title: "Intel 80386DX Processor",
        marks: 30
    },
    {
        title: "Pentium Procressor",
        marks: 40
    },
    {
        title: "SuperSPARC Architecture",
        marks: 30
    },
];

const subQuestions = [{
    title: "List the features of 8086 microprocessor",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What are the characteristics of a microprocessor",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What are the functions of the microprocessor buses",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What are the basic functions of microprocessor",
    module: "Intel 8086/8088 Architetcture"
    },{
    title:"With the help of a block diagram explain the architecture of a microprocessor",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What is segmented memory ?",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What are the advantages of segmentation with reference to 8086 microprocessor, also explain the default segment assignments",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the memory segmentation in Intel 8086 processor with its advantages and disadvantages",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Write a short note on Memory banking in 8086",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Draw and explain the architecture of 8086",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Write a detailed note on Branch instruction of the 8086",
    module: "Instruction Set and Programming"
    },{
    title: "Write a short note on Addressing modes in the 8086",
    module: "Instruction Set and Programming"
    },{
    title: "Fixed and Variable port addressing formats",
    module: "Instruction Set and Programming"
    },{
    title: "Write a short note on string instructions in 8086",
    module: "Instruction Set and Programming"
    },{
    title: "Write a short note on addressing modes of 8086",
    module: "Instruction Set and Programming"
    },{
    title: "Write a short note on switch port and variable port addressing",
    module: "Instruction Set and Programming"
    },{
    title: "Explain assembler directives of 8086",
    module: "Instruction Set and Programming"
    },{
    title: "Write a short note on mixed mode programming",
    module: "Instruction Set and Programming"
    },{
    title: "Write a short note on 8284 clock generator",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Draw the circuit diagram for generation of reset signal and explain its working",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the status signals of Intel 8086 processor",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Draw the timing diagram and explain for memory read in minimum mode",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Draw the timing diagram and explain for memory write in maximum mode",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Write a short note on 8288 bus controller",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the necessity of a bus controller in 8086 maximum mode operation also explain the 8288 bus controller in detail",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the 8288 bus controller block diagram and explain its use",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What is maximum mode of 8086 ? How it differs from minimum mode ?",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the hardware required to generate clock and reset signals",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain interrupts of 8086 in detail",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Difference between Software and Hardware interrupt",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "What is an ISR ? How does 8086 acknowledge an interrupt ? Draw flowchart from interrupt processing sequence",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "How does 8086 the priority of interrupts? ",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the initialization command words and operational command words of the 8259 PIC",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the operation of IC 8259 with the block diagram. Explain all the signals in detail",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the fully nested mode of 8259",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain the operation command words of 8259",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain ICWs of interrupt controller 8259",
    module: "Intel 8086/8088 Architetcture"
    },{
    title: "Explain operating modes of the 8255 PPI",
    module: "System designing with 8086"
    },{
    title: "Explain the handshaking operation for input and output in mode 1",
    module: "System designing with 8086"
    },{
    title: "Draw and explain architecture of 8255 draw and explain the 4×4 keyboard interfacing using 8255",
    module: "System designing with 8086"
    },{
    title: "Write a short note on modes of operation of 8253 PIT",
    module: "System designing with 8086"
    },{
    title: "Explain the operation of IC 8254 as a square wave generator with the control word and timing diagram for Count value of 4",
    module: "System designing with 8086"
    },{
    title: "Explain the operating modes of 8254 PIT",
    module: "System designing with 8086"
    },{
    title: "Write a short note on 8253 programming interrupt timer",
    module: "System designing with 8086"
    },{
    title: "Draw and explain about Block diagram of PIT 8253",
    module: "System designing with 8086"
    },{
    title: "What is mean by direct memory access show as interfacing diagram of 8086 microprocessor with 8237 DMA controller",
    module: "System designing with 8086C"
    },{
    title: "Explain the modes of operation of a DMA controller",
    module: "System designing with 8086"
    },{
    title: "What is meant by DMA. Show interfacing of 8237/57 with 8086 and explain",
    module: "System designing with 8086"
    },{
    title: "Explain different modes of 8237 A",
    module: "System designing with 8086"
    },{
    title: "Write a short note on DRAM controller",
    module: "System designing with 8086"
    },{
    title: "Describe the various system bus arbitration in loosely coupled system",
    module: "System designing with 8086"
    },{
    title: "Write a detailed note on 8289 bus arbiter emphasis on its role in a multiprocessor system",
    module: "System designing with 8086"
    },{
    title: "What do you understand by bus arbitration Explain the different bus arbitration techniques with diagram",
    module: "System designing with 8086"
    },{
    title: "Explain the different bus arbitration techniques with their advantages and disadvantages",
    module: "System designing with 8086"
    },{
    title: "Explain different multiprocessor systems with merits and demerits of each",
    module: "System designing with 8086"
    },{
    title: "Explain in brief loosely coupled systems also explain coprocessor interfacing with 8086",
    module: "System designing with 8086"
    },{
    title: "Differentiate between the memory mapped I/O and I/O mapped I/O",
    module: "System designing with 8086"
    },{
    title: "Explain in brief address decoding techniques",
    module: "System designing with 8086"
    },{
    title: "Draw the block diagram of 80386 DX processor and explain each block in brief",
    module: "Intel 80386DX Processor"
    },{
    title: "Differentiate segmentation in real mode and protected mode",
    module: "Intel 80386DX Processor"
    },{
    title: "Discuss the register set of 80386 processor",
    module: "Intel 80386DX Processor"
    },{
    title: "Explain EFLAGS bits of Pentium",
    module: "Intel 80386DX Processor"
    },{
    title: "Explain the protection mechanism of ×86 Intel family processor",
    module: "Intel 80386DX Processor"
    },{
    title: "Explain segment translation mechanism with flowchart also explain segment descriptor",
    module: "Intel 80386DX Processor"
    },{
    title: "Write short note on CALL gate mechanism",
    module: "Intel 80386DX Processor"
    },{
    title: "What is descriptor explain code and data segment descriptor with diagram",
    module: "Intel 80386DX Processor"
    },{
    title: "Explain protection mechanism implemented on 80386 DX",
    module: "Intel 80386DX Processor"
    },{
    title: "Write a short note on operating modes of 80386",
    module: "Intel 80386DX Processor"
    },{
    title: "Explain how the flushing of pipeline problem is minimized in pentium at architecture",
    module: "Pentium Procressor"
    },{
    title: "Write a short note on branch prediction logic",
    module: "Pentium Procressor"
    },{
    title: "Explain different stages of floating point pipeline of Pentium processor",
    module: "Pentium Procressor"
    },{
    title: "Explain the cache organization of Pentium",
    module: "Pentium Procressor"
    },{
    title: "Draw and explain the state transition diagram for Pentium processors bus cycle",
    module: "Pentium Procressor"
    },{
    title: "Explain instruction pairing rules of Pentium, also explain the 'Instruction Issue' algorithm in detail",
    module: "Pentium Procressor"
    },{
    title: "Explain data cache organization of Pentium",
    module: "Pentium Procressor"
    },{
    title: "Explain the dynamic branch prediction logic in Pentium",
    module: "Pentium Procressor"
    },{
    title: "Draw and explain Pentium processor architecture",
    module: "Pentium Procressor"
    },{
    title: "Explain data cache organization of Pentium and give emphasis on triple ported access of data cache",
    module: "Pentium Procressor"
    },{
    title: "Explain instruction pairing on Pentium processor",
    module: "Pentium Procressor"
    },{
    title: "Explain integer pipeline of Pentium processor",
    module: "Pentium Procressor"
    },{
    title: "Explain Pentium processor architecture with block diagram",
    module: "Pentium Procressor"
    },{
    title: "Explain branch prediction logic implemented on Pentium processor",
    module: "Pentium Procressor"
    },{
    title: "Explain the data types supported by SPARC architecture",
    module: "SuperSPARC Architecture"
    },{
    title: "Explain the architecture of super SPARC microprocessor with the help of neat block diagram",
    module: "SuperSPARC Architecture"
    },{
    title: "Draw and explain various instruction formats of SPARC processor",
    module: "SuperSPARC Architecture"
    },{
    title: "Explain cache/MMU organization of super SPARC processor",
    module: "SuperSPARC Architecture"
    },{
    title: "Explain in detail, register file of SPARC processor",
    module: "SuperSPARC Architecture"
    }];


const seedDB = async function() {
    const sub = new Subject({title: "Microprocessor", maxMarks: 80, totalMarks: 120, semester: 5, branch: "Computer"});
    await sub.save();
    for(let module of subModules) {
        const newModule = new Module(module);
        newModule.subject = sub._id;
        newModule.numOfQuestions = 0;
        sub.modules.push(newModule);
        await newModule.save();
        await sub.save();

        // for(let i = 0; i < 15; i++) {
        //     const newQuestion = new Question({title: faker.lorem.sentence(), module: newModule._id});
        //     newModule.questions.push(newQuestion);
        //     await newModule.save();
        //     await newQuestion.save();
        // }
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