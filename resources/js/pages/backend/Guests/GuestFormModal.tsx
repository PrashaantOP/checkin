import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Guest = {
  id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  id_proof_type?: string;
  id_proof_number?: string;
  is_profile_completed?: boolean;
};

type Props = {
  guest?: Guest;
  onSave: (data: Guest) => void;
  buttonText?: string;
};

export default function GuestFormModal({ guest, onSave, buttonText = "Add Guest" }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Guest>(
    guest || {
      first_name: "", last_name: "",
      email: "", phone: "",
      address: "", city: "", country: "", id_proof_type: "", id_proof_number: ""
    }
  );

  const isProfileCompleted =
    !!form.first_name && !!form.last_name && !!form.email &&
    !!form.phone && !!form.address && !!form.city && !!form.country &&
    !!form.id_proof_type && !!form.id_proof_number;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, is_profile_completed: isProfileCompleted ? 1 : 0 });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md md:max-w-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto shadow-xl rounded-lg border bg-white dark:bg-neutral-900">
      <DialogTitle>
        {guest ? "Edit Guest" : "Add Guest"}
        </DialogTitle>
        <DialogDescription>
        {guest
            ? "Update the Guest details below and click update to save changes."
            : "Please provide all details below to add a new Guest."}
        </DialogDescription>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Stack fields column on mobile, grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
            <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <Input label="Email" name="email" type="email" value={form.email || ""} onChange={handleChange} required />
          <Input label="Phone" name="phone" value={form.phone || ""} onChange={handleChange} required />
          <Input label="Address" name="address" value={form.address || ""} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="City" name="city" value={form.city || ""} onChange={handleChange} required />
            <Input label="Country" name="country" value={form.country || ""} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="ID Proof Type" name="id_proof_type" value={form.id_proof_type || ""} onChange={handleChange} required />
            <Input label="ID Proof Number" name="id_proof_number" value={form.id_proof_number || ""} onChange={handleChange} required />
          </div>
          <div className="mt-2">
            <Button type="submit" className="w-full md:w-auto">{guest ? "Update" : "Save"}</Button>
          </div>
        </form>
        <div className="mt-3 text-xs text-center">
          <span className={isProfileCompleted ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {isProfileCompleted ? "Profile will be saved as Completed." : "Profile will be saved as Incomplete."}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Input({ label, name, value, onChange, required = false, type = "text" }: any) {
  return (
    <div className="flex flex-col flex-1 w-full">
      <label className="mb-1 font-semibold text-gray-700 dark:text-neutral-300 text-xs md:text-sm">{label}{required ? " *" : ""}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 w-full"
        autoComplete="off"
      />
    </div>
  );
}
