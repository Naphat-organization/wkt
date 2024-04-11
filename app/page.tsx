"use client";

import React, { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>('');
  const [time, settime] = useState(0);
  const isMap = useRef(false);
  const zoomCount = useRef(0);
  const Scale = useRef(0);
  const MinX = useRef(0);
  const MaxY = useRef(0);
  const scaleRef = useRef(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setSelectedFile(file);

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        drawPolygons(content);
      };
      reader.readAsText(file);
    }
  };

  const drawPolygons = (wktString: string) => {
    let start = performance.now();
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    let minX = 1000;
    let minY = 1000;
    let maxX = 0;
    let maxY = 0;
    let maxXY = 0;

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const polygons = wktString.split('\n');

      polygons.forEach((polygonWKT) => {
        const coordinates = polygonWKT.match(/(\d+\.\d+)\s(\d+\.\d+)/g);
        if (coordinates) {
          coordinates.forEach((coordinate: string, index: number) => {
            const [x, y] = coordinate.split(' ').map(parseFloat);

            if (x < minX) {
              minX = x;
            }
            if (y < minY) {
              minY = y;
            }
            if (x > maxX) {
              maxX = x;
            }
            if (y > maxY) {
              maxY = y;
            }
            if (index === 0) {
              context.moveTo(x, y);
            } else {
              context.lineTo(x, y);
            }
          });
        }
      });
      maxXY = Math.max(maxX - minX, maxY - minY);
      Scale.current = 600 / maxXY;
      scaleRef.current = Scale.current;
      MinX.current = minX;
      MaxY.current = maxY;
      zoomCount.current = 0;
      drawMap(wktString, minX, maxY, Scale.current);
    }
    let timeTaken: number = parseFloat((performance.now() - start).toFixed(2));
    settime(timeTaken);
  };

  const drawMap = (wktString: string, minX: any, maxY: any, scaleData: number) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const polygons = wktString.split('\n');

      polygons.forEach((polygonWKT) => {
        const coordinates = polygonWKT.match(/(\d+\.\d+)\s(\d+\.\d+)/g);
        if (coordinates) {
          context.beginPath();
          coordinates.forEach((coordinate: string, index: number) => {
            const [x, y] = coordinate.split(' ').map(parseFloat);
            const scaleX = parseFloat(((x - minX) * scaleData).toFixed(5));
            const scaleY = parseFloat((((-y + maxY) * scaleData).toFixed(5)))
            if (index === 0) {
              context.moveTo(scaleX, scaleY);
            } else {
              context.lineTo(scaleX, scaleY);
            }
          });
        }
        context.closePath();
        context.stroke();
      });
      isMap.current = true;
    }
  };

  const zoomIn = () => {
    if (zoomCount.current < 10 && isMap.current) {
      Scale.current += scaleRef.current/10;
      //Scale.current *= 1.2;
      zoomCount.current += 1;
      MinX.current += 1;
      MaxY.current -= 1;
      drawMap(fileContent, MinX.current, MaxY.current, Scale.current);
    }
  };

  const zoomOut = () => {
    if (zoomCount.current > -10 && isMap.current) {
      Scale.current -= scaleRef.current/10;
      //Scale.current *= 0.833;
      zoomCount.current -= 1;
      MinX.current -= 1;
      MaxY.current += 1;
      drawMap(fileContent, MinX.current, MaxY.current, Scale.current);
    }
  };

  return (
    <div className='h-screen center'>

      <div className='h-[800px] w-[800px] p-9 border border-black bg-orange-300 center'>

        <div>
          <div className='flex justify-between items-center'>
            <label>
              <input
                type="file"
                accept=".wkt"
                hidden
                onChange={handleFileChange}
              />
              <div className="HeaderButton flex items-center justify-center border-2 cursor-pointer">
                <span>Select WKT</span>
              </div>
            </label>

            <div>
              <button className='zoomButton mx-2' onClick={zoomIn}>+</button>
              <button className='zoomButton' onClick={zoomOut}>-</button>
            </div>
          </div>
          {selectedFile != undefined ?
            <>
              <div>{`Selected File: ${selectedFile.name} `}</div>
              <div>{`Total time taken : ${time} milliseconds`}</div>
            </>
            : null}

          <canvas id="canvas" width="600" height="600" className='border border-black bg-white center mt-5'></canvas>
        </div>
      </div>
    </div>
  );
}














