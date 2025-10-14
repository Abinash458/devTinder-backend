const corn = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");

corn.schedule("0 8 * * * *", async () => {
  //   Send email to all people who got requests the previous day

  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        console.log(email);
        // send email toEmailId
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {}
});
