<table id="descriptives_table" class="stripeMe">
  <thead>
    <tr>
      <th></th>
      <th colspan="2">Inbound</th>
      <th colspan="2">Outbound</th>
    <tr>
      <th>Period</th>
      <th>Boardings</th>
      <th>Alightings</th>
      <th>Boardings</th>
      <th>Alightings</th>
    </tr>
  </thead>
  <tbody>
    {#foreach $T as post}
    <tr>
      <td>{ $T.post$key }</td>
      <td>{ $T.post.one.ons }</td>
      <td>{ $T.post.one.offs }</td>
      <td>{ $T.post.zero.ons }</td>
      <td>{ $T.post.zero.offs }</td>
    </tr>
    {#/for}
  </tbody>
</table>