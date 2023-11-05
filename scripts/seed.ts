const {PrismaClient} = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data:[
                {name: "Computer Science"},
                {name: "Electrical and Electronics"},
                {name: "Data Science"},
                {name: "Artificial Intelligence and Machine Learning"},
                {name: "Chemical Engineering"},
                {name: "Mechanical Engineering"},
                {name: "Aeronautical Engineering"},
                {name: "Biotech Engineering"},
            ]
        });

        
    } catch (error) {
        console.log("Error seeding the database categories", error)
    } finally{
        await database.$disconnect();
    }
}

main();
