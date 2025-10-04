import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Room = {
  id?: number,
  name: string,
  description: string,
  max_guests: number,
  base_price: number,
  status: string
};

type Props = {
  room?: Room;
  onSave: (data: Room) => void;
  buttonText?: string | React.ReactNode;
};

export default function RoomFormModal({ room, onSave, buttonText = "Add Room" }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Room>(room || {
    name: "",
    description: "",
    max_guests: 1,
    base_price: 0,
    status: "Available"
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {typeof buttonText === "string" ? (
          <Button variant="default">{buttonText}</Button>
        ) : (
          <button className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
            {buttonText}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-md md:max-w-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto shadow-xl rounded-lg border bg-white dark:bg-neutral-900">
      <DialogTitle>{room ? "Edit Room" : "Add Room"}</DialogTitle>
      <DialogDescription>
    {room
      ? "Update the room details and click update."
      : "Please provide details to add a new room."}
  </DialogDescription>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input label="Room Name" name="name" value={form.name} onChange={handleChange} required />
          <TextArea label="Description" name="description" value={form.description} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Max Guests" name="max_guests" value={form.max_guests} onChange={handleChange} type="number" min={1} required />
            <Input label="Base Price" name="base_price" value={form.base_price} onChange={handleChange} type="number" min={0} required />
          </div>
          <Select label="Status" name="status" value={form.status} onChange={handleChange} required>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_order">Out of Order</option>
            </Select>

          <div className="mt-2">
            <Button type="submit" className="w-full md:w-auto">{room ? "Update Room" : "Save Room"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Input({ label, name, value, onChange, ...props }: any) {
  return (
    <div className="flex flex-col flex-1 w-full">
      <label className="mb-1 font-semibold text-gray-700 dark:text-neutral-300 text-xs md:text-sm">{label}{props.required ? " *" : ""}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 w-full"
        autoComplete="off"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, ...props }: any) {
  return (
    <div className="flex flex-col flex-1 w-full">
      <label className="mb-1 font-semibold text-gray-700 dark:text-neutral-300 text-xs md:text-sm">{label}{props.required ? " *" : ""}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="rounded-md border border-gray-300 px-3 py-2 h-24 resize-y text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 w-full"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, children, ...props }: any) {
  return (
    <div className="flex flex-col flex-1 w-full">
      <label className="mb-1 font-semibold text-gray-700 dark:text-neutral-300 text-xs md:text-sm">{label}{props.required ? " *" : ""}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 w-full"
      >
        {children}
      </select>
    </div>
  );
}
