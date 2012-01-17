<table id="top_trips_table" class="stripeMe">
  <thead>
    <tr>
      <th>Trip ID</th>
      <th>Boardings</th>
      <th>Alightings</th>
      <th>Max Load</th>
    </tr>
  </thead>
  <tbody>
    {#foreach $T as post}
    <tr>
      <td><span class="fakelink" onclick="force_show_trip({$T.post.ext_trip_id});">{$T.post.departure_time}</span></td>
      <td>{$T.post.ons}</td>
      <td>{$T.post.offs}</td>
      <td>{$T.post.max_load}</td>
    </tr>
    {#/for}
  </tbody>
</table>