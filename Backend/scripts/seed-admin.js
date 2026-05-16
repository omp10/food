import { connectDB, disconnectDB } from '../src/config/db.js';
import { FoodAdmin } from '../src/core/admin/admin.model.js';

const DEFAULT_ADMIN = {
    email: process.env.ADMIN_SEED_EMAIL || 'admin@appzeto.com',
    password: process.env.ADMIN_SEED_PASSWORD || 'Admin@123',
    name: process.env.ADMIN_SEED_NAME || 'Super Admin',
    phone: process.env.ADMIN_SEED_PHONE || '9999999999'
};

async function seedAdmin() {
    await connectDB();

    const email = String(DEFAULT_ADMIN.email).trim().toLowerCase();
    const password = String(DEFAULT_ADMIN.password);
    const name = String(DEFAULT_ADMIN.name).trim();
    const phone = String(DEFAULT_ADMIN.phone).trim();

    let admin = await FoodAdmin.findOne({ email });

    if (!admin) {
        admin = new FoodAdmin({
            email,
            password,
            name,
            phone,
            role: 'ADMIN',
            adminType: 'SUPER_ADMIN',
            isActive: true,
            permissions: [],
            servicesAccess: ['food']
        });
    } else {
        admin.email = email;
        admin.password = password;
        admin.name = name;
        admin.phone = phone;
        admin.role = 'ADMIN';
        admin.adminType = 'SUPER_ADMIN';
        admin.isActive = true;
        admin.permissions = [];
        admin.servicesAccess = ['food'];
    }

    await admin.save();

    console.log(
        JSON.stringify(
            {
                message: 'Admin seeded successfully',
                email,
                password,
                adminId: String(admin._id),
                adminType: admin.adminType
            },
            null,
            2
        )
    );
}

seedAdmin()
    .catch((error) => {
        console.error('Failed to seed admin:', error?.message || error);
        process.exitCode = 1;
    })
    .finally(async () => {
        try {
            await disconnectDB();
        } catch (_error) {
            // Ignore disconnect errors during script shutdown.
        }
    });
