import { useEffect, useRef } from "react";
import { useDesignStore } from "@/lib/design-store";
import { Skeleton } from "@/components/ui/skeleton";
// @ts-ignore
import * as fabric from "fabric";

interface EditorCanvasProps {
  width: number;
  height: number;
  isLoading?: boolean;
}

export default function EditorCanvas({ width, height, isLoading = false }: EditorCanvasProps) {
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    canvasObjects, 
    setSelectedElement, 
    selectedElement, 
    updateCanvasObject
  } = useDesignStore();

  // Initialize canvas
  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    // Create fabric canvas
    const canvas = new fabric.Canvas('editor-canvas', {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    });

    // Store canvas in ref
    canvasRef.current = canvas;

    // Selection events
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected.length > 0) {
        const obj = e.selected[0];
        setSelectedElement({
          id: obj.data?.id || Date.now().toString(),
          type: obj.type || 'object',
          props: extractObjectProperties(obj)
        });
      }
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected.length > 0) {
        const obj = e.selected[0];
        setSelectedElement({
          id: obj.data?.id || Date.now().toString(),
          type: obj.type || 'object',
          props: extractObjectProperties(obj)
        });
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    // Object modification events
    canvas.on('object:modified', (e) => {
      if (e.target) {
        const obj = e.target;
        const id = obj.data?.id || Date.now().toString();
        updateCanvasObject(id, extractObjectProperties(obj));
      }
    });

    // Clean up on unmount
    return () => {
      canvas.dispose();
    };
  }, [isLoading, width, height, setSelectedElement, updateCanvasObject]);

  // Update canvas when objects change
  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    const canvas = canvasRef.current;
    canvas.clear();

    // Add objects to canvas
    canvasObjects.forEach((obj, index) => {
      const id = obj.id || `obj-${index}`;

      // Create fabric objects based on type
      let fabricObj;

      switch (obj.type) {
        case 'text':
          fabricObj = new fabric.Text(obj.text || 'Text', {
            left: obj.left || 0,
            top: obj.top || 0,
            fontFamily: obj.fontFamily || 'Inter',
            fontSize: obj.fontSize || 20,
            fontWeight: obj.fontWeight || 'normal',
            fill: obj.fill || '#2D2D2D',
            width: obj.width,
            textAlign: obj.textAlign as any || 'left',
            data: { id }
          });
          break;
        case 'rect':
          fabricObj = new fabric.Rect({
            left: obj.left || 0,
            top: obj.top || 0,
            width: obj.width || 100,
            height: obj.height || 100,
            fill: obj.fill || '#F3F4F6',
            stroke: obj.stroke || '#D1D5DB',
            strokeWidth: obj.strokeWidth || 1,
            rx: obj.rx || 0,
            ry: obj.ry || 0,
            data: { id }
          });
          break;
        case 'circle':
          fabricObj = new fabric.Circle({
            left: obj.left || 0,
            top: obj.top || 0,
            radius: obj.radius || 50,
            fill: obj.fill || '#F3F4F6',
            stroke: obj.stroke || '#D1D5DB',
            strokeWidth: obj.strokeWidth || 1,
            data: { id }
          });
          break;
        // Add more object types as needed
      }

      if (fabricObj) {
        fabricObj.setControlsVisibility({
          mtr: true, // rotate
          mt: true, mr: true, mb: true, ml: true // resize
        });
        canvas.add(fabricObj);
      }
    });

    // Render canvas
    canvas.renderAll();
  }, [canvasObjects, isLoading]);

  // Helper function to extract properties from fabric objects
  const extractObjectProperties = (obj: any) => {
    const props: any = {
      left: obj.left,
      top: obj.top,
      width: obj.width,
      height: obj.height,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      angle: obj.angle,
    };

    // Text-specific properties
    if (obj.type === 'text') {
      const textObj = obj as any;
      props.text = textObj.text;
      props.fontFamily = textObj.fontFamily;
      props.fontSize = textObj.fontSize;
      props.fontWeight = textObj.fontWeight;
      props.textAlign = textObj.textAlign;
      props.fill = textObj.fill;
    }

    // Shape properties
    if (obj.type === 'rect' || obj.type === 'circle') {
      props.fill = obj.fill;
      props.stroke = obj.stroke;
      props.strokeWidth = obj.strokeWidth;
    }

    return props;
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg my-6" style={{ width, height }}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="bg-white shadow-lg my-6"
      style={{ width, height }}
    >
      <canvas id="editor-canvas"></canvas>
    </div>
  );
}
