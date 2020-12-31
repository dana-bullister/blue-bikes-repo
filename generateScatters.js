// function to generate a scatter plot, given the name of an accessible csv
// file with appropriately formatted data, the ID of an HTML element into
// which to plop the scatter plot, and a boolean value of whether the
// scatterplot should animate
function generateScatter(csvFileName, chartAreaID, size, animate, y_val_max) {

  // define a parser for parsing csv columns representing datetimes (but
  // formatted as strings) as the appropriate date objects
  let parseDatetime = d3.timeParse("%Y-%m-%d %H:%M:%S");

  // define a datetime formatter for formmatting a date object in a way that is
  // cleanly readable as a date (specifically, "June 30, 2015")
  let formatDatetime = d3.timeFormat("%A, %B %d, %Y");

  // infer the month the bike data is describing based on the file name and
  // store this as a set of useful variables
  let bikeDataYear = csvFileName.substring(0, 4); // e.g., "2019"
  let bikeDataMonth = csvFileName.substring(4, 6); // e.g., "09"
  let bikeDataDateStr = bikeDataYear + '-' + bikeDataMonth + '-01'; // set it to start of month
  let bikeDataDatetimeStr = bikeDataDateStr + ' 00:00:00';
  let bikeDataDate = parseDatetime(bikeDataDatetimeStr);

  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let bikeDataMonthName = monthNames[bikeDataDate.getMonth()];

  // set min and max values for axes
  let secondDay = new Date(); // variable for the second day of the month
  secondDay.setTime(bikeDataDate);
  secondDay.setDate(2);

  let x_val_min = bikeDataDate,
    x_val_max = secondDay,
    y_val_min = 0;
  // y_val_max has already been defined

  let chart_area = d3.select("#" + chartAreaID)

  // set padding and spacing
  let showMainTitle = true, // related variables
    showSubtitle1 = true,
    showAxesLabels = true,
    subtitle2Padding = 82,
    subtitle2FontSize = "1em",
    subtitle2Text = "For an Average Day in " + bikeDataMonthName + ', ' + bikeDataYear,
    chartAreaPadding = {
      top: 130,
      right: 30,
      bottom: 130,
      left: 65
    },
    chartAreaWidth = 560,
    chartAreaHeight = 600,
    xAxisTickFormat = "%-I %p",
    xAxisTickPadding = 0,
    x_axis_ticks = [
      new Date(bikeDataDateStr + ' 02:00:00'),
      new Date(bikeDataDateStr + ' 04:00:00'),
      new Date(bikeDataDateStr + ' 06:00:00'),
      new Date(bikeDataDateStr + ' 08:00:00'),
      new Date(bikeDataDateStr + ' 10:00:00'),
      new Date(bikeDataDateStr + ' 12:00:00'),
      new Date(bikeDataDateStr + ' 14:00:00'),
      new Date(bikeDataDateStr + ' 16:00:00'),
      new Date(bikeDataDateStr + ' 18:00:00'),
      new Date(bikeDataDateStr + ' 20:00:00'),
      new Date(bikeDataDateStr + ' 22:00:00')
    ],
    xTickLabelTilt = -65,
    xTickLabelAnchor = 'end',
    yAxisTickInterval = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
    dataPointRadius = 1;


  if (size == "small") { // adjust these if creating a small version of plot
    showMainTitle = false,
      showSubtitle1 = false,
      showAxesLabels = false,
      subtitle2Padding = 32,
      subtitle2FontSize = 27,
      subtitle2Text = bikeDataMonthName,
      chartAreaPadding = {
        top: 48,
        right: 11,
        bottom: 25,
        left: 29
      },
      smallMultChartScaling = .34,
      chartAreaWidth = chartAreaWidth * smallMultChartScaling,
      chartAreaHeight = chartAreaHeight * smallMultChartScaling,
      xAxisTickFormat = "%-I %p",
      xAxisTickPadding = 9,
      x_axis_ticks = [
        new Date(bikeDataDateStr + ' 03:00:00'),
        new Date(bikeDataDateStr + ' 12:00:00'),
        new Date(bikeDataDateStr + ' 21:00:00')
      ],
      xTickLabelTilt = 0,
      xTickLabelAnchor = 'start',
      yAxisTickInterval = [0, y_val_max / 2, y_val_max],
      dataPointRadius = 0.4;
  }

  let titleAdjustLeft = 10,
    graph_width = chartAreaWidth - chartAreaPadding.left - chartAreaPadding.right,
    graph_height = chartAreaHeight - chartAreaPadding.top - chartAreaPadding.bottom;

  // add chart div
  let chart = chart_area
    .append("div")
    .attr("id", "chart")

  // add chart background
  let chart_background = chart
    .append("svg")
    .attr("id", "chart_background")
    .attr("width", chartAreaWidth)
    .attr("height", chartAreaHeight);

  if (showMainTitle) {
    // add chart main title
    chart_background.append("text")
      .attr("font-family", "sans-serif, Arial, Helvetica")
      .attr("text-anchor", "middle")
      .attr("x", (graph_width / 2) + chartAreaPadding.left - titleAdjustLeft)
      .attr("y", 30)
      .attr("font-size", "1.5em")
      .attr("font-family", "Helvetica")
      .text("Bluebike Trip Duration By Time Of Day");
  }

  if (showSubtitle1) {
    // add chart subtitle
    chart_background.append("text")
      .attr("font-family", "sans-serif, Arial, Helvetica")
      .attr("text-anchor", "middle")
      .attr("x", (graph_width / 2) + chartAreaPadding.left - titleAdjustLeft)
      .attr("y", 59)
      .attr("font-size", "1em")
      .text("All  Rides in Boston, Cambridge, Brookline, Somerville");
  }

  // add chart third title
  chart_background.append("text")
    .attr("font-family", "sans-serif, Arial, Helvetica")
    .attr("text-anchor", "middle")
    .attr("x", (graph_width / 2) + chartAreaPadding.left - titleAdjustLeft)
    .attr("y", subtitle2Padding)
    .attr("font-size", subtitle2FontSize)
    .text(subtitle2Text);

  if (showAxesLabels) {
    // add x-axis label
    chart_background.append("text")
      .attr("font-family", "sans-serif, Arial, Helvetica")
      .attr("text-anchor", "middle")
      .attr("x", (graph_width / 2) + chartAreaPadding.left)
      .attr("y", graph_height + chartAreaPadding.top + 60)
      .text("Trip Start Time");

    // add y-axis label
    chart_background.append("text")
      .attr("font-family", "sans-serif, Arial, Helvetica")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", chartAreaPadding.left / 2 - 5)
      .attr("x", -chartAreaPadding.top - graph_height / 2)
      .text("Trip Duration (Minutes)")
  }

  // add  group that will contain chart elements
  let graph_elems = chart_background
    .append("g")
    .attr("id", "graph_elems")
    .attr("transform", "translate(" + chartAreaPadding.left + "," + chartAreaPadding.top + ")");

  // read data
  d3.csv(csvFileName).then((bike_data) => {

      let tripDurSum = 0;
      let numIncludedPoints = 0;
      let outlierThreshold = 600;

      for (let i = 0; i < bike_data.length; i++) {
        let tripDurInMin = parseInt(bike_data[i]['tripduration'], 10) / 60;
        if (tripDurInMin <= outlierThreshold) {
          tripDurSum += tripDurInMin; //don't forget to add the base
          numIncludedPoints += 1;
        }
      }
      let tripDurAvg = tripDurSum / numIncludedPoints;

      // add x axis
      let x = d3.scaleLinear()
        .domain([x_val_min, x_val_max])
        .range([0, graph_width]);

      let x_axis = graph_elems
        .append('g')
        .attr("id", "x_axis")
        .attr("transform", "translate(0," + graph_height + ")")
        .call(d3.axisBottom(x)
          .tickValues(x_axis_ticks)
          .tickFormat(d3.timeFormat(xAxisTickFormat))
          .tickPadding(xAxisTickPadding))
        .selectAll("text")
        .style("text-anchor", xTickLabelAnchor)
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(" + xTickLabelTilt + ")");

      // add y axis
      let y = d3.scaleLinear()
        .domain([y_val_min, y_val_max]);

      if (animate) {
        y.range([graph_height, graph_height]); // start with all points collapsed on the bottom axis (they will animate to the correct location upon load)
      } else {
        y.range([graph_height, 0]);
      }

      let y_axis = graph_elems
        .append('g')
        .attr("id", "y_axis")
        .call(d3.axisLeft(y)
          .tickValues(yAxisTickInterval)
        );

      // add horizontal line representing average y-value
      graph_elems.append("svg:line")
        .attr("x1", 0)
        .attr("x2", graph_width)
        .attr("y1", y(tripDurAvg))
        .attr("y2", y(tripDurAvg))
        .attr("id", "horizLine")
        .style("stroke", "black");

      // format data for appropriate display
      function formatData(rowOfData) {

        // parse all dates in data set as the appropriate date objects
        rowOfData.starttime = parseDatetime(rowOfData.starttime);

        // set their corresponding day as the first of the month (that way all
        // data points fall within same 24h period and constitute a 'typical
        // day')
        rowOfData.starttime.setDate(1);

        // convert all values for tripduration to minutes from seconds
        rowOfData.tripduration = rowOfData.tripduration / 60;
      }
      bike_data.forEach(formatData);

      // filter the data to ensure none go outside the ranges of the axes
      function filterToWithinAxesRange(data) {
        return data.filter(function(point) {
          return point.starttime >= x_val_min && point.starttime <= x_val_max && point.tripduration >= y_val_min && point.tripduration <= y_val_max;
        });
      }
      bike_data = filterToWithinAxesRange(bike_data);

      // binding data
      let data_points = graph_elems
        .selectAll("data_points")
        .data(bike_data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return x(d.starttime)
        })
        .attr("cy", function(d) {
          return y(d.tripduration)
        })
        .attr("class", "data_point")
        .attr("fill", "darkblue")
        .attr("r", dataPointRadius);

      if (animate) {
        // animate data points to travel to their y-coordinate location from the bottom
        // by first adjusting the range of the y-axis
        y.range([graph_height, 0]);

        chart_background.select("#y_axis")
          .transition()
          .duration(500)
          .call(d3.axisLeft(y));

        // transition the points to their correct location
        data_points
          .transition()
          .delay(function(d, i) {
            // delay proportional to the number of seconds from the start of
            // the day
            let secsFromStart = (60 * 60 * d.starttime.getHours()) + (60 * d.starttime.getMinutes()) + d.starttime.getSeconds()
            return (secsFromStart / 10)
          })
          .duration(2000)
          .attr("cx", function(d) {
            return x(d.starttime);
          })
          .attr("cy", function(d) {
            return y(d.tripduration);
          })
      }
    })
    .catch((error) => {
      console.error("Error loading the data");
    });
}

// generate a scatter plot for each sample of blue bike data (corresponding
// to one day from each season)
generateScatter("201909-bluebikes-tripdata.csv", "main_chart_area", "big", true, 100);

function genRestOfScatters() {
  generateScatter("201901-bluebikes-tripdata.csv", "item1", "small", false, 30);
  generateScatter("201902-bluebikes-tripdata.csv", "item2", "small", false, 30);
  generateScatter("201903-bluebikes-tripdata.csv", "item3", "small", false, 30);
  generateScatter("201904-bluebikes-tripdata.csv", "item4", "small", false, 30);
  generateScatter("201905-bluebikes-tripdata.csv", "item5", "small", false, 30);
  generateScatter("201906-bluebikes-tripdata.csv", "item6", "small", false, 30);
  generateScatter("201907-bluebikes-tripdata.csv", "item7", "small", false, 30);
  generateScatter("201908-bluebikes-tripdata.csv", "item8", "small", false, 30);
  generateScatter("201909-bluebikes-tripdata.csv", "item9", "small", false, 30);
  generateScatter("201910-bluebikes-tripdata.csv", "item10", "small", false, 30);
  generateScatter("201911-bluebikes-tripdata.csv", "item11", "small", false, 30);
  generateScatter("201912-bluebikes-tripdata.csv", "item12", "small", false, 30);

  // display associated labelling
  d3.select(".small_mult_chart_descript1")
    .style("opacity", 1);

  // display associated labelling
  d3.select(".small_mult_chart_descript2")
    .style("opacity", 1);

  d3.select("#bottom_descript1")
    .style("opacity", 1);

  d3.select("#bottom_descript2")
    .style("opacity", 1);

  d3.select("#small_mult_chart_title")
    .style("opacity", 1);

  d3.select("#small_mult_chart_title2")
    .style("opacity", 1);

  d3.select("#sm_mult_x_axis_label")
    .style("opacity", 1);

  d3.select("#sm_mult_y_axis_label")
    .style("opacity", 1);

  d3.select("#bluebikeimg")
    .style("opacity", 1);

}

genRestOfScatters();