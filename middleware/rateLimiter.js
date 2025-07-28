import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 100,
  message: {
    message: "Too many requests from this IP, please try again after 15 mins.",
  },
});

export default limiter;
