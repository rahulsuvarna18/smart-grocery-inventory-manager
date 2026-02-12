import React from "react";
import { Form, FormGroup, GoogleAuthMessage, Input, Label, SaveButton } from "./Dashboard.styles";

interface ProfileFormProps {
  formData: {
    fullName: string;
    email: string;
  };
  isUpdating: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  user: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ formData, isUpdating, handleChange, handleSubmit, user }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Full Name</Label>
        <Input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      </FormGroup>

      <FormGroup>
        <Label>Email</Label>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled={user?.app_metadata?.provider === "google"} />
        {user?.app_metadata?.provider === "google" && <GoogleAuthMessage>Email cannot be changed for Google-authenticated accounts</GoogleAuthMessage>}
      </FormGroup>

      <SaveButton type="submit" disabled={isUpdating}>
        {isUpdating ? "Saving..." : "Save Changes"}
      </SaveButton>
    </Form>
  );
};

export default ProfileForm;
