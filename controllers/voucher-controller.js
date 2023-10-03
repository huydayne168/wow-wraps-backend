const Voucher = require("../models/Voucher");
const cron = require("node-cron");
const { validationResult } = require("express-validator");

// add voucher:
exports.addVoucher = async (req, res, next) => {
    try {
        const inputError = validationResult(req);
        if (!inputError.isEmpty()) {
            return res.status(422).json({
                validationErrors: inputError.array(),
            });
        }
        const { code, discountPercent, quantity, end } = req.body;

        // check if duplicate code:
        const existedVoucherCode = await Voucher.find({
            code: code,
            isDeleted: false,
        });
        console.log(existedVoucherCode);
        if (existedVoucherCode[0]) {
            return res.sendStatus(409);
        }

        const newVoucher = new Voucher({
            code,
            discountPercent,
            quantity,
            end,
            isDeleted: false,
        });
        await newVoucher.save();
        const endTime = new Date(end);
        const now = new Date();
        const stringEndTime = `${endTime.getMinutes()} ${
            endTime.getHours() > now.getHours() ? endTime.getHours() : "*"
        } ${endTime.getDate() > now.getDate() ? endTime.getDate() : "*"} ${
            endTime.getMonth() > now.getMonth() ? start.getMonth() + 1 : "*"
        } *`;
        const voucherTimeUp = cron.schedule(stringEndTime, async () => {
            newVoucher.isDeleted = true;
            await newVoucher.save();
            voucherTimeUp.stop();
        });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const applyFilters = (vouchers, { page, sortQuantity, codeQuery }) => {
    console.log(codeQuery);
    const filteredVouchers = [];
    for (const voucher of vouchers) {
        if (
            codeQuery &&
            !voucher.code.toLowerCase().includes(codeQuery.toLowerCase())
        ) {
            continue;
        }

        filteredVouchers.push(voucher);
    }
    if (sortQuantity) {
        if (JSON.parse(sortQuantity)) {
            filteredVouchers.sort((v1, v2) => v2.quantity - v1.quantity);
        } else if (!JSON.parse(sortQuantity)) {
            filteredVouchers.sort((v1, v2) => v1.quantity - v2.quantity);
        }
    }
    if (!page) {
        return {
            vouchers: filteredVouchers,
            totalVouchers: filteredVouchers.length,
        };
    }
    const curPage = Number(page);
    return {
        vouchers: filteredVouchers.slice(
            (curPage - 1) * 5,
            (curPage - 1) * 5 + 5
        ),
        totalVouchers: filteredVouchers.length,
    };
};

// get flash sales:
exports.getVoucher = async (req, res, next) => {
    try {
        const vouchers = await Voucher.find({ isDeleted: false });
        console.log(vouchers);
        return res.status(200).json(applyFilters(vouchers, req.query));
    } catch (error) {
        next(error);
    }
};

// delete voucher:
exports.deleteVoucher = async (req, res, next) => {
    try {
        const voucherId = req.query.voucherId;
        const voucher = await Voucher.findById(voucherId);
        if (!voucher) return res.sendStatus(409);
        voucher.isDeleted = true;
        await voucher.save();
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
