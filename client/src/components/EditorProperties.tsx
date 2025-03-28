import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDesignStore } from "@/lib/design-store";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from "lucide-react";

const fontOptions = [
  { value: "Poppins", label: "Poppins" },
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Montserrat", label: "Montserrat" }
];

const fontSizeOptions = [
  { value: "72", label: "72px" },
  { value: "64", label: "64px" },
  { value: "48", label: "48px" },
  { value: "36", label: "36px" },
  { value: "24", label: "24px" },
  { value: "18", label: "18px" },
  { value: "14", label: "14px" }
];

const fontWeightOptions = [
  { value: "bold", label: "Bold" },
  { value: "medium", label: "Medium" },
  { value: "regular", label: "Regular" },
  { value: "light", label: "Light" }
];

const colorOptions = [
  { value: "#2D2D2D", label: "Text", className: "bg-[#2D2D2D]" },
  { value: "#4B4DED", label: "Primary", className: "bg-[#4B4DED]" },
  { value: "#FF5C5C", label: "Secondary", className: "bg-[#FF5C5C]" },
  { value: "#00C4CC", label: "Accent", className: "bg-[#00C4CC]" },
  { value: "#FFFFFF", label: "White", className: "bg-white border border-gray-200" }
];

export default function EditorProperties() {
  const { canvasProps, setCanvasProps, selectedElement, updateSelectedElement } = useDesignStore();
  const [textContent, setTextContent] = useState("");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [fontSize, setFontSize] = useState("64");
  const [fontWeight, setFontWeight] = useState("bold");
  const [textColor, setTextColor] = useState("#2D2D2D");
  const [textAlign, setTextAlign] = useState("center");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Update form state when selected element changes
  useEffect(() => {
    if (selectedElement && selectedElement.type === 'text') {
      setTextContent(selectedElement.props.text || "");
      setFontFamily(selectedElement.props.fontFamily || "Poppins");
      setFontSize(String(selectedElement.props.fontSize || 64));
      setFontWeight(selectedElement.props.fontWeight || "bold");
      setTextColor(selectedElement.props.fill || "#2D2D2D");
      setTextAlign(selectedElement.props.textAlign || "center");
      setPosition({ 
        x: Math.round(selectedElement.props.left || 0), 
        y: Math.round(selectedElement.props.top || 0) 
      });
    }
  }, [selectedElement]);

  // Handler for canvas dimension changes
  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setCanvasProps({ ...canvasProps, [dimension]: value });
  };

  // Text property change handlers
  const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
    if (selectedElement && selectedElement.type === 'text') {
      updateSelectedElement({ text: e.target.value });
    }
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    if (selectedElement && selectedElement.type === 'text') {
      updateSelectedElement({ fontFamily: value });
    }
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    if (selectedElement && selectedElement.type === 'text') {
      updateSelectedElement({ fontSize: parseInt(value) });
    }
  };

  const handleFontWeightChange = (value: string) => {
    setFontWeight(value);
    if (selectedElement && selectedElement.type === 'text') {
      updateSelectedElement({ fontWeight: value });
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    if (selectedElement && selectedElement.type === 'text') {
      updateSelectedElement({ fill: color });
    }
  };

  const handleTextAlignChange = (align: string) => {
    setTextAlign(align);
    if (selectedElement && selectedElement.type === 'text') {
      updateSelectedElement({ textAlign: align });
    }
  };

  // Position change handlers
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    
    if (selectedElement) {
      updateSelectedElement({ 
        left: axis === 'x' ? value : selectedElement.props.left,
        top: axis === 'y' ? value : selectedElement.props.top
      });
    }
  };

  return (
    <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Design Properties</h3>
      </div>
      <div className="p-4">
        {/* Document properties */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Document</h4>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm text-gray-900">Width</Label>
            <div className="flex items-center">
              <Input
                type="number"
                value={canvasProps.width}
                onChange={(e) => handleDimensionChange('width', parseInt(e.target.value))}
                className="w-16 text-sm text-center h-8"
              />
              <span className="ml-1 text-sm text-gray-400">px</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm text-gray-900">Height</Label>
            <div className="flex items-center">
              <Input
                type="number"
                value={canvasProps.height}
                onChange={(e) => handleDimensionChange('height', parseInt(e.target.value))}
                className="w-16 text-sm text-center h-8"
              />
              <span className="ml-1 text-sm text-gray-400">px</span>
            </div>
          </div>
        </div>

        {/* Selected element properties */}
        {selectedElement && selectedElement.type === 'text' && (
          <div className="mb-5">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Selected Element</h4>
            <div className="mb-3">
              <Label className="text-sm text-gray-900 block mb-1">Text Content</Label>
              <Textarea
                value={textContent}
                onChange={handleTextContentChange}
                className="text-sm"
                rows={2}
              />
            </div>
            <div className="mb-3">
              <Label className="text-sm text-gray-900 block mb-1">Font</Label>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-sm text-gray-900 block mb-1">Size</Label>
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-900 block mb-1">Weight</Label>
                <Select value={fontWeight} onValueChange={handleFontWeightChange}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeightOptions.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-3">
              <Label className="text-sm text-gray-900 block mb-1">Color</Label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full ${color.className} flex items-center justify-center ${
                      textColor === color.value ? 'border-2 border-gray-300' : 'border-2 border-transparent'
                    }`}
                    onClick={() => handleTextColorChange(color.value)}
                    title={color.label}
                  >
                    {textColor === color.value && color.value !== '#FFFFFF' && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                    {textColor === color.value && color.value === '#FFFFFF' && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
                <button className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mb-3">
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 p-2 ${textAlign === 'left' ? 'bg-gray-100' : ''}`}
                onClick={() => handleTextAlignChange('left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 p-2 ${textAlign === 'center' ? 'bg-gray-100' : ''}`}
                onClick={() => handleTextAlignChange('center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 p-2 ${textAlign === 'right' ? 'bg-gray-100' : ''}`}
                onClick={() => handleTextAlignChange('right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 p-2 ${textAlign === 'justify' ? 'bg-gray-100' : ''}`}
                onClick={() => handleTextAlignChange('justify')}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="flex-1 p-2">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 p-2">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 p-2">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
              </Button>
            </div>
          </div>
        )}

        {/* Position controls for all elements */}
        {selectedElement && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Position</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-sm text-gray-900 block mb-1">X</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={position.x}
                    onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                    className="w-full text-sm text-center h-8"
                  />
                  <span className="ml-1 text-sm text-gray-400">px</span>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-900 block mb-1">Y</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={position.y}
                    onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                    className="w-full text-sm text-center h-8"
                  />
                  <span className="ml-1 text-sm text-gray-400">px</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
