import { Knex } from "knex";
import { encryptPassword } from "../../app/utils/encrypt";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();
    
    const encryptedPassword = await encryptPassword('superadmin');

    // Inserts seed entries
    await knex("users").insert([
        { 
            name: "Super Admin", 
            email: "superadmin@binarrental.id",
            password: encryptedPassword,
            role: "superadmin"
        },
    ]);
};
