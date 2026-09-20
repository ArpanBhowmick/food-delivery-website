import nodemailer, {
  type SendMailOptions,
  type SentMessageInfo,
  type Transporter,
} from "nodemailer";

let transporter: Transporter | undefined;

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required email environment variable: ${name}`);
  }

  return value;
};

const getTransporter = (): Transporter => {
  if (transporter) {
    return transporter;
  }

  const host = getRequiredEnvironmentVariable("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = getRequiredEnvironmentVariable("SMTP_USER");
  const pass = getRequiredEnvironmentVariable("SMTP_PASS");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

export const sendEmail = async (
  options: Omit<SendMailOptions, "from"> & { from?: string },
): Promise<SentMessageInfo> => {
  const from = options.from?.trim() || getRequiredEnvironmentVariable("EMAIL_FROM");

  return getTransporter().sendMail({
    ...options,
    from,
  });
};

export default sendEmail;