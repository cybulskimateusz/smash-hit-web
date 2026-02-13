const getLinesFromPolygon = (cell: Polygon): number[] => {
  const lines = [];

  for (let i = 0; i < cell.length - 1; i++) {
    const startPoint = cell[i];
    const endPoint = cell[i+1];

    lines.push(startPoint[0], startPoint[1], 0); 
    lines.push(endPoint[0], cell[i + 1][1], 0);
  }

  return lines;
};

export default getLinesFromPolygon;