import { connectDB, disconnectDB } from '../src/config/db.js';
import { FoodAdmin } from '../src/core/admin/admin.model.js';

const email = String(process.env.ADMIN_SEED_EMAIL || 'admin@appzeto.com').trim().toLowerCase();

async function main() {
    await connectDB();
    const admin = await FoodAdmin.findOne({ email }).select('email name role adminType isActive createdAt updatedAt');
    if (!admin) {
        console.log(JSON.stringify({ found: false, email }, null, 2));
        return;
    }

    console.log(
        JSON.stringify(
            {
                found: true,
                admin
            },
            null,
            2
        )
    );
}

main()
    .catch((error) => {
        console.error('Failed to check admin:', error?.message || error);
        process.exitCode = 1;
    })
    .finally(async () => {
        try {
            await disconnectDB();
        } catch (_error) {
            // Ignore disconnect errors during script shutdown.
        }
    });
