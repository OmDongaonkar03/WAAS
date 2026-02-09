import prisma from "../db/prisma.js";
import crypto from "crypto";
import { generateVerificationToken, verifyVerificationToken } from "../utils/jwt.js";
import { sendMail } from "../utils/mail.js";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from "../utils/errors.js";