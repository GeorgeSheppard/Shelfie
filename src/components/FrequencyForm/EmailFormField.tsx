import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const EmailFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="w-[256px]">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input className="bg-card" placeholder="" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
