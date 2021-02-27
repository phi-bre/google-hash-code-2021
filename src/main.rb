
puts "read file"
filename = ARGV[0]
lines = File.read("#{__dir__}/../in/#{filename}.txt").split(/\n/)
duration, intersection_count, street_count, car_count, car_score = lines.first.split.map(&:to_i)

intersections = (0..intersection_count).map { |i| { from: [], to: [] } }

streets = lines[1..street_count].map do |line|
    from, to, name, length = line.split
    from, to, length = [from, to, length].map(&:to_i)
    street = { from: intersections[from], to: intersections[to], name: name, duration: length }
    intersections[from][:from] << street
    intersections[to][:to] << street
    [name, street]
end.to_h

cars = lines[(street_count + 1)..(car_count + street_count)].map do |line| 
    { path: line.split.drop(1) }
end

# TODO: Remove cars that can't reach the end
# TODO: Remove streets that don't have cars

streets.values.each do |street|
    street[:cars] = cars.select { |car| car[:path].include?(street[:name]) }
end

puts "calculate schedules"
schedules = intersections.map.with_index do |intersection, index|
    # calculate percentages for streets, so that the better streets are green for longer durations
    { 
        index: index,
        timeline: intersection[:to]
            .map { |street| {
                street: street,
                duration: (duration / intersection[:to].count).to_i,
            } }
            .reject { |t| t[:duration].zero? }
            .sort_by { |t| t[:street][:cars].sum { |c| c[:path].count } }
    } 
end.reject { |s| s[:timeline].empty? }

puts "simulation"
cars.each do |car|
    car[:street_index] = 0
    car[:street_duration] = 0
end

schedules.each do |schedule|
    schedule[:timeline_index] = 0 
    schedule[:timeline_duration] = 0
    intersections[schedule[:index]][:schedule] = schedule
end

streets.values.each do |street|
    street[:car_queue] = []
end

score = 0
(0..duration).each do |time|
    # puts "time is #{time}"
    schedules.each do |schedule|
        if schedule[:timeline_duration] == 0
            schedule[:timeline_index] = (schedule[:timeline_index] + 1) % schedule[:timeline].count
            schedule[:timeline_duration] = schedule[:timeline][schedule[:timeline_index]][:duration] - 1
            # puts "street #{schedule[:timeline][schedule[:timeline_index]][:street][:name]} is now green"
        else
            schedule[:timeline_duration] -= 1
            street_schedule = schedule[:timeline][schedule[:timeline_index]]
            next_car = street_schedule[:street][:car_queue].shift
            next unless next_car

            next_car[:street_index] += 1

            if next_car[:street_index] < next_car[:path].count
                next_street = streets[next_car[:path][next_car[:street_index]]]
                # puts "car #{next_car[:path].count} has passed green light on street #{street_schedule[:street][:name]} onto #{next_street[:name]}"
                next_car[:street_duration] = next_street[:duration] + 1
            else
                score += 1 #+ (duration - (time))
                cars.delete(next_car)
            end
        end
    end
    cars.each do |car|
        if car[:street_duration] == 0
            current_street = streets[car[:path][car[:street_index]]]
            current_street[:car_queue] << car
            # puts "car #{car[:path].count} got to end of street #{current_street[:name]}"
        else
            car[:street_duration] -= 1
            # puts "car #{car[:path].count} went to index #{car[:street_index]} of #{streets[car[:path][car[:street_index]]][:duration]}"
        end
    end
end

puts "score: #{score} \n#{car_count - cars.count} of #{car_count} cars have arrived"

text = "#{schedules.count}\n#{
    schedules.map do |schedule|
        "#{schedule[:index]}\n#{schedule[:timeline].count}\n#{
            schedule[:timeline].map { |timeline| "#{timeline[:street][:name]} #{timeline[:duration]}" }.join("\n")
        }"
    end.join("\n")
}"
File.write("#{__dir__}/../out/#{filename}.out", text)
