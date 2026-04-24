
DROP POLICY "Anyone can submit booking" ON public.bookings;

CREATE POLICY "Anyone can submit valid booking" ON public.bookings
FOR INSERT WITH CHECK (
  char_length(customer_name) BETWEEN 1 AND 100
  AND char_length(phone) BETWEEN 8 AND 15
  AND char_length(pickup_location) BETWEEN 1 AND 200
  AND status = 'new'
);
