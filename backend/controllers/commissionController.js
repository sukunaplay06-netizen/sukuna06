const Commission = require('../models/Commission');

exports.calculateCommissionStats = async (userId) => {
  try {
    // Today's start (00:00:00)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Last 7 days start
    const last7DaysStart = new Date(todayStart);
    last7DaysStart.setDate(last7DaysStart.getDate() - 7);

    // Last 30 days start
    const last30DaysStart = new Date(todayStart);
    last30DaysStart.setDate(last30DaysStart.getDate() - 30);

    const [todayAgg, last7Agg, last30Agg, allTimeAgg] = await Promise.all([
      Commission.aggregate([
        { $match: { user: userId, purchaseDate: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Commission.aggregate([
        { $match: { user: userId, purchaseDate: { $gte: last7DaysStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Commission.aggregate([
        { $match: { user: userId, purchaseDate: { $gte: last30DaysStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Commission.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return {
      todayEarnings: todayAgg[0]?.total || 0,
      last7DaysEarnings: last7Agg[0]?.total || 0,
      last30DaysEarnings: last30Agg[0]?.total || 0,
      allTimeEarnings: allTimeAgg[0]?.total || 0
    };
  } catch (err) {
    console.error('Error calculating commission stats:', err);
    return {
      todayEarnings: 0,
      last7DaysEarnings: 0,
      last30DaysEarnings: 0,
      allTimeEarnings: 0
    };
  }
};

exports.addManualCommission = async (req, res) => {
  try {
    const { userId, amount, date } = req.body;

    if (!userId || !amount || !date) {
      return res.status(400).json({ message: 'userId, amount, date required' });
    }

    // Optional: Admin check - agar strict admin only chahiye to uncomment kar do
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Admin only' });
    // }

    const newCommission = new Commission({
      user: userId,
      amount: Number(amount),
      purchaseDate: new Date(date),
      course: null,
      referredUser: null,
      createdAt: new Date(),
    });

    await newCommission.save();

    res.json({
      success: true,
      message: 'Manual commission added successfully',
      addedAmount: amount,
      affectedDate: date,
    });
  } catch (err) {
    console.error('Error adding manual commission:', err);
    res.status(500).json({ message: 'Server error' });
  }
};