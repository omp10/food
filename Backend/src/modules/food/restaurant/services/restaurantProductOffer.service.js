import mongoose from 'mongoose';
import { ValidationError } from '../../../../core/auth/errors.js';
import { RestaurantOffer } from '../models/restaurantOffer.model.js';

const ensureObjectId = (id, label) => {
    if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
        throw new ValidationError(`Invalid ${label}`);
    }
    return new mongoose.Types.ObjectId(String(id));
};

export async function createRestaurantProductOffer(restaurantId, body = {}) {
    const rid = ensureObjectId(restaurantId, 'restaurant id');
    const productId = ensureObjectId(body.productId, 'productId');

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) throw new ValidationError('Title is required');

    const discountType = body.discountType === 'flat-price' ? 'flat-price' : 'percentage';
    const discountValue = Number(body.discountValue);
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
        throw new ValidationError('Discount value must be greater than 0');
    }
    let maxDiscount = null;
    if (discountType === 'percentage') {
        maxDiscount = Number(body.maxDiscount);
        if (!Number.isFinite(maxDiscount) || maxDiscount <= 0) {
            throw new ValidationError('maxDiscount is required for percentage offers');
        }
    }

    const minOrderValue = body.minOrderValue !== undefined ? Number(body.minOrderValue) : 0;
    const usageLimit = body.usageLimit !== undefined ? Number(body.usageLimit) : null;
    const perUserLimit = body.perUserLimit !== undefined ? Number(body.perUserLimit) : null;

    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;
    if (startDate && Number.isNaN(startDate.getTime())) throw new ValidationError('Invalid startDate');
    if (endDate && Number.isNaN(endDate.getTime())) throw new ValidationError('Invalid endDate');
    if (startDate && endDate && endDate <= startDate) throw new ValidationError('endDate must be after startDate');

    const doc = await RestaurantOffer.create({
        restaurantId: rid,
        createdByRestaurantId: rid,
        productId,
        title,
        discountType,
        discountValue,
        maxDiscount,
        minOrderValue: Number.isFinite(minOrderValue) ? minOrderValue : 0,
        usageLimit: Number.isFinite(usageLimit) && usageLimit >= 0 ? usageLimit : null,
        perUserLimit: Number.isFinite(perUserLimit) && perUserLimit >= 0 ? perUserLimit : null,
        startDate: startDate || null,
        endDate: endDate || null,
        status: 'inactive',
        approvalStatus: 'pending',
        showInCart: true
    });

    return doc.toObject();
}

export async function listRestaurantProductOffers(restaurantId) {
    const rid = ensureObjectId(restaurantId, 'restaurant id');
    const list = await RestaurantOffer.find({ restaurantId: rid }).sort({ createdAt: -1 }).lean();
    return list.map((o) => ({
        ...o,
        id: String(o._id)
    }));
}

export async function deleteRestaurantProductOffer(restaurantId, offerId) {
    const rid = ensureObjectId(restaurantId, 'restaurant id');
    const oid = ensureObjectId(offerId, 'offer id');
    const offer = await RestaurantOffer.findOne({ _id: oid, restaurantId: rid }).lean();
    if (!offer) return null;
    await RestaurantOffer.deleteOne({ _id: oid });
    return { id: String(offerId) };
}

export async function updateRestaurantProductOffer(restaurantId, offerId, body = {}) {
    const rid = ensureObjectId(restaurantId, 'restaurant id');
    const oid = ensureObjectId(offerId, 'offer id');
    const existing = await RestaurantOffer.findOne({ _id: oid, restaurantId: rid }).lean();
    if (!existing) return null;

    const title = typeof body.title === 'string' ? body.title.trim() : existing.title;
    if (!title) throw new ValidationError('Title is required');

    const discountType = body.discountType === 'flat-price' ? 'flat-price' : 'percentage';
    const discountValue = body.discountValue !== undefined ? Number(body.discountValue) : existing.discountValue;
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
        throw new ValidationError('Discount value must be greater than 0');
    }
    let maxDiscount = existing.maxDiscount;
    if (discountType === 'percentage') {
        maxDiscount = body.maxDiscount !== undefined ? Number(body.maxDiscount) : existing.maxDiscount;
        if (!Number.isFinite(maxDiscount) || maxDiscount <= 0) {
            throw new ValidationError('maxDiscount is required for percentage offers');
        }
    } else {
        maxDiscount = null;
    }

    const minOrderValue = body.minOrderValue !== undefined ? Number(body.minOrderValue) : existing.minOrderValue;
    const usageLimit = body.usageLimit !== undefined ? Number(body.usageLimit) : existing.usageLimit;
    const perUserLimit = body.perUserLimit !== undefined ? Number(body.perUserLimit) : existing.perUserLimit;

    const startDate = body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : existing.startDate;
    const endDate = body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : existing.endDate;
    if (startDate && Number.isNaN(startDate.getTime())) throw new ValidationError('Invalid startDate');
    if (endDate && Number.isNaN(endDate.getTime())) throw new ValidationError('Invalid endDate');
    if (startDate && endDate && endDate <= startDate) throw new ValidationError('endDate must be after startDate');

    const updated = await RestaurantOffer.findOneAndUpdate(
        { _id: oid, restaurantId: rid },
        {
            $set: {
                title,
                discountType,
                discountValue,
                maxDiscount,
                minOrderValue: Number.isFinite(minOrderValue) ? minOrderValue : 0,
                usageLimit: Number.isFinite(usageLimit) && usageLimit >= 0 ? usageLimit : null,
                perUserLimit: Number.isFinite(perUserLimit) && perUserLimit >= 0 ? perUserLimit : null,
                startDate: startDate || null,
                endDate: endDate || null,
                approvalStatus: 'pending',
                status: 'inactive',
                rejectionReason: ''
            }
        },
        { new: true }
    ).lean();

    return updated;
}
