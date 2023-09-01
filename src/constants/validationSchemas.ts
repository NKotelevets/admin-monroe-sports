import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const GetStartedSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  privacyPolicy: Yup.boolean().required(),
});

export const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required(),
  // dateOfBirth: Yup.string().required(),
  zip: Yup.string().required(),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(),
  privacyPolicy: Yup.boolean()
    .oneOf([true], "You must accept the privacy policy")
    .required(),
});

export const AthleteSchema = Yup.object().shape({
  name: Yup.string().required(),
  // dateOfBirth: Yup.string().required(),
  zip: Yup.string().required(),
  email: Yup.string().email(),
});

export const JoinTeamSchema = Yup.object().shape({
  parenOrGuardianEmail: Yup.string().email().required(),
});
