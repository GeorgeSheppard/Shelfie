import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

export const RecurringFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="recurringMonthly"
      render={({ field }) => (
        <FormItem className="flex flex-row gap-1 w-[256px] items-center">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="!mt-0">
            Send me recommendations monthly
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
