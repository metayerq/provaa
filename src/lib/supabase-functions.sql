-- Function to safely increment event spots_left
CREATE OR REPLACE FUNCTION public.increment_event_spots(
  event_id uuid,
  spots_to_add integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.events 
  SET spots_left = spots_left + spots_to_add
  WHERE id = event_id;
END;
$$;

-- Function to update event capacity and recalculate spots_left
CREATE OR REPLACE FUNCTION public.update_event_capacity(
  event_id uuid,
  new_capacity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_booked_spots integer;
BEGIN
  -- Get current confirmed bookings count
  SELECT COALESCE(SUM(number_of_tickets), 0)
  INTO current_booked_spots
  FROM public.bookings 
  WHERE event_id = update_event_capacity.event_id 
    AND status = 'confirmed' 
    AND spots_decremented = true;
  
  -- Update capacity and recalculate spots_left
  UPDATE public.events 
  SET 
    capacity = new_capacity,
    spots_left = new_capacity - current_booked_spots
  WHERE id = update_event_capacity.event_id;
END;
$$;

-- Function to recalculate all event spots based on confirmed bookings with spots_decremented = true
CREATE OR REPLACE FUNCTION public.fix_event_spots_consistency()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update spots_left for all events based on confirmed bookings with spots_decremented = true
  UPDATE public.events 
  SET spots_left = capacity - COALESCE(confirmed_bookings.total_tickets, 0)
  FROM (
    SELECT 
      event_id,
      SUM(number_of_tickets) as total_tickets
    FROM public.bookings 
    WHERE status = 'confirmed' AND spots_decremented = true
    GROUP BY event_id
  ) confirmed_bookings
  WHERE events.id = confirmed_bookings.event_id;
  
  -- Reset spots_left to capacity for events with no confirmed bookings with spots_decremented = true
  UPDATE public.events 
  SET spots_left = capacity
  WHERE id NOT IN (
    SELECT DISTINCT event_id 
    FROM public.bookings 
    WHERE status = 'confirmed' AND spots_decremented = true
  );
END;
$$;
