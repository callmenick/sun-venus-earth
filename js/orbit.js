(function() {
  'use strict';

  /* ------------------------------------------------------------ *\
      Some orbital constants to trim down giant numbers
  \* ------------------------------------------------------------ */

  var orbitDenominator = 600000;
  var orbitPadding = 40;

  /* ------------------------------------------------------------ *\
      Some planet constants to trim down giant numbers
  \* ------------------------------------------------------------ */

  var planetDenominator = 500;
  var sunDenominator = 20000;

  /* ------------------------------------------------------------ *\
      Some sun variables
  \* ------------------------------------------------------------ */

  var sunRadius = Math.floor(696342/sunDenominator);
  var sunColour = '#ff3300';

  /* ------------------------------------------------------------ *\
      Some venus variables
  \* ------------------------------------------------------------ */

  var venusRadius = Math.floor(6052/planetDenominator);
  var venusAphelion = Math.floor(108939000/orbitDenominator);
  var venusPerihelion = Math.floor(107477000/orbitDenominator);
  var venusEccentricity = 0.0068;
  var venusSemiMajor = Math.floor(venusAphelion + venusPerihelion);
  var venusSemiMinor = getSemiMinorAxis(venusSemiMajor, venusEccentricity);
  var venusVelocity = 35.02;
  var venusPeriod = 224.70;
  var venusColour = '#b28544';

  /* ------------------------------------------------------------ *\
      Some earth variables
  \* ------------------------------------------------------------ */

  var earthRadius = Math.floor(6371/planetDenominator);
  var earthAphelion = Math.floor(152100100/orbitDenominator);
  var earthPerihelion = Math.floor(147095000/orbitDenominator);
  var earthEccentricity = 0.0167086;
  var earthSemiMajor = Math.floor((earthAphelion + earthPerihelion));
  var earthSemiMinor = getSemiMinorAxis(earthSemiMajor, earthEccentricity);
  var earthVelocity = 29.78;
  var earthPeriod = 365.256;
  var earthColour = '#2850dc';

  /* ------------------------------------------------------------ *\
      Some orbital bounding variables
  \* ------------------------------------------------------------ */

  var orbitMajorBounds = Math.max(venusSemiMajor, earthSemiMajor);
  var orbitMinorBounds = Math.max(venusSemiMinor, earthSemiMinor);
  var orbitCenter = {
    x: orbitMajorBounds/2 + orbitPadding,
    y: orbitMinorBounds/2 + orbitPadding
  };
  var orbitAphelion = Math.max(venusAphelion, earthAphelion);
  var orbitPerihelion = Math.max(venusPerihelion, earthPerihelion);

  /* ------------------------------------------------------------ *\
      Some view box variables (based on orbitals and paddings)
  \* ------------------------------------------------------------ */

  var viewBoxWidth = orbitMajorBounds + orbitPadding*2;
  var viewBoxHeight = orbitMinorBounds + orbitPadding*2;

  /* ------------------------------------------------------------ *\
      Set up the orbit box
  \* ------------------------------------------------------------ */

  var orbit = d3.select('.js-orbit-container')
    .append('svg')
    .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight)
    .attr('width', viewBoxWidth)
    .attr('height', viewBoxHeight)
    .attr('class', 'Orbit');

  /* ------------------------------------------------------------ *\
      Set up veuns' elliptical orbit
  \* ------------------------------------------------------------ */

  var venusVertices = [
    {
      x: orbitCenter.x - venusSemiMajor/2,
      y: orbitCenter.y
    },
    {
      x: orbitCenter.x,
      y: orbitCenter.y - venusSemiMinor/2
    },
    {
      x: orbitCenter.x + venusSemiMajor/2,
      y: orbitCenter.y
    },
    {
      x: orbitCenter.x,
      y: orbitCenter.y + venusSemiMinor/2
    }
  ];

  var venusPaths = [
    `M ${venusVertices[0].x} ${venusVertices[0].y}`,
    `A ${venusSemiMajor/2} ${venusSemiMinor/2} 0 0 1 ${venusVertices[1].x} ${venusVertices[1].y}`,
    `A ${venusSemiMajor/2} ${venusSemiMinor/2} 0 0 1 ${venusVertices[2].x} ${venusVertices[2].y}`,
    `A ${venusSemiMajor/2} ${venusSemiMinor/2} 0 0 1 ${venusVertices[3].x} ${venusVertices[3].y}`,
    `A ${venusSemiMajor/2} ${venusSemiMinor/2} 0 0 1 ${venusVertices[0].x} ${venusVertices[0].y}`,
    `Z`
  ];

  var venusPath = venusPaths.join(' ');

  var venusEllipse = orbit.append('path')
    .attr('d', venusPath)
    .attr('stroke', '#333')
    .attr('stroke-width', 1)
    .attr('fill', 'none');

  /* ------------------------------------------------------------ *\
      Set up earth's elliptical orbit
  \* ------------------------------------------------------------ */

  var earthVertices = [
    {
      x: orbitCenter.x - earthSemiMajor/2,
      y: orbitCenter.y
    },
    {
      x: orbitCenter.x,
      y: orbitCenter.y - earthSemiMinor/2
    },
    {
      x: orbitCenter.x + earthSemiMajor/2,
      y: orbitCenter.y
    },
    {
      x: orbitCenter.x,
      y: orbitCenter.y + earthSemiMinor/2
    }
  ];

  var earthPaths = [
    `M ${earthVertices[0].x} ${earthVertices[0].y}`,
    `A ${earthSemiMajor/2} ${earthSemiMinor/2} 0 0 1 ${earthVertices[1].x} ${earthVertices[1].y}`,
    `A ${earthSemiMajor/2} ${earthSemiMinor/2} 0 0 1 ${earthVertices[2].x} ${earthVertices[2].y}`,
    `A ${earthSemiMajor/2} ${earthSemiMinor/2} 0 0 1 ${earthVertices[3].x} ${earthVertices[3].y}`,
    `A ${earthSemiMajor/2} ${earthSemiMinor/2} 0 0 1 ${earthVertices[0].x} ${earthVertices[0].y}`,
    `Z`
  ];

  var earthPath = earthPaths.join(' ');

  var earthEllipse = orbit.append('path')
    .attr('d', earthPath)
    .attr('stroke', '#333')
    .attr('stroke-width', 1)
    .attr('fill', 'none');

  /* ------------------------------------------------------------ *\
      Set up the sun
  \* ------------------------------------------------------------ */

  var sun = orbit.append('circle')
    .attr('cx', orbitPadding + orbitAphelion)
    .attr('cy', orbitPadding + orbitMinorBounds/2)
    .attr('r', sunRadius)
    .attr('fill', sunColour);

  /* ------------------------------------------------------------ *\
      Set up venus (the planet)
  \* ------------------------------------------------------------ */

  var venusAngle = 0;
  var venusMotion = (2 * Math.PI)/venusPeriod;
  var venusCoordinates = getVenusCoordinates(venusAngle);

  var venusPlanet = orbit.append('circle')
    .attr('cx', venusCoordinates.x)
    .attr('cy', venusCoordinates.y)
    .attr('r', venusRadius)
    .attr('fill', venusColour);

  /* ------------------------------------------------------------ *\
      Set up earth (the planet)
  \* ------------------------------------------------------------ */

  var earthAngle = 0;
  var earthMotion = (2 * Math.PI)/earthPeriod;
  var earthCoordinates = getEarthCoordinates(earthAngle);

  var earthPlanet = orbit.append('circle')
    .attr('cx', earthCoordinates.x)
    .attr('cy', earthCoordinates.y)
    .attr('r', earthRadius)
    .attr('fill', earthColour);

  /* ------------------------------------------------------------ *\
      Animate the planets
  \* ------------------------------------------------------------ */

  d3.timer(function() {
    earthAngle += earthMotion;
    earthCoordinates = getEarthCoordinates(earthAngle);
    earthPlanet
      .attr('cx', earthCoordinates.x)
      .attr('cy', earthCoordinates.y);

    venusAngle += venusMotion;
    venusCoordinates = getVenusCoordinates(venusAngle);
    venusPlanet
      .attr('cx', venusCoordinates.x)
      .attr('cy', venusCoordinates.y);
  });

  /* ------------------------------------------------------------ *\
      Helper functions
  \* ------------------------------------------------------------ */

  function getSemiMinorAxis(semiMajorAxis, ecc) {
    return Math.floor(semiMajorAxis * (Math.sqrt(1 - Math.pow(ecc, 2))));
  }

  function getEllipseCoordinates(alpha, a, b) {
    return {
      x: orbitCenter.x - a*(Math.cos(alpha)),
      y: orbitCenter.y - b*(Math.sin(alpha))
    };
  }

  function getVenusCoordinates(alpha) {
    return getEllipseCoordinates(alpha, venusSemiMajor/2, venusSemiMinor/2);
  }

  function getEarthCoordinates(alpha) {
    return getEllipseCoordinates(alpha, earthSemiMajor/2, earthSemiMinor/2);
  }

  function degreesToRadians(alpha) {
    return alpha * ((Math.PI*2)/360);
  }

  function radiansToDegrees(alpha) {
    return alpha*(360/(Math.PI*2));
  }
})();
