import { create } from 'zustand';

// Canvas object type
export interface CanvasObject {
  id?: string;
  type: string;
  [key: string]: any;
}

// Selected element state
export interface SelectedElement {
  id: string;
  type: string;
  props: Record<string, any>;
}

// Canvas properties
export interface CanvasProps {
  width: number;
  height: number;
  category?: string;
}

// Design store state
interface DesignState {
  canvasProps: CanvasProps;
  canvasObjects: CanvasObject[];
  selectedElement: SelectedElement | null;
  
  // Actions
  setCanvasProps: (props: Partial<CanvasProps>) => void;
  setCanvasObjects: (objects: CanvasObject[]) => void;
  addCanvasObject: (object: CanvasObject) => void;
  updateCanvasObject: (id: string, props: Record<string, any>) => void;
  deleteCanvasObject: (id: string) => void;
  setSelectedElement: (element: SelectedElement | null) => void;
  updateSelectedElement: (props: Record<string, any>) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  // Initial state
  canvasProps: {
    width: 600,
    height: 800,
    category: 'signboard'
  },
  canvasObjects: [],
  selectedElement: null,
  
  // Actions
  setCanvasProps: (props) => 
    set((state) => ({ 
      canvasProps: { ...state.canvasProps, ...props } 
    })),
  
  setCanvasObjects: (objects) => 
    set({ canvasObjects: objects }),
  
  addCanvasObject: (object) => 
    set((state) => {
      const newObject = {
        ...object,
        id: object.id || `obj-${Date.now()}`
      };
      return { canvasObjects: [...state.canvasObjects, newObject] };
    }),
  
  updateCanvasObject: (id, props) => 
    set((state) => ({
      canvasObjects: state.canvasObjects.map((obj) => 
        (obj.id === id || (!obj.id && id === `obj-${Date.now()}`)) 
          ? { ...obj, ...props } 
          : obj
      )
    })),
  
  deleteCanvasObject: (id) => 
    set((state) => ({
      canvasObjects: state.canvasObjects.filter((obj) => obj.id !== id)
    })),
  
  setSelectedElement: (element) => 
    set({ selectedElement: element }),
  
  updateSelectedElement: (props) => 
    set((state) => {
      if (!state.selectedElement) return state;
      
      // Update the selected element properties
      const updatedElement = {
        ...state.selectedElement,
        props: {
          ...state.selectedElement.props,
          ...props
        }
      };
      
      // Also update the corresponding canvas object
      const updatedCanvasObjects = state.canvasObjects.map((obj) => 
        obj.id === state.selectedElement?.id 
          ? { ...obj, ...props } 
          : obj
      );
      
      return { 
        selectedElement: updatedElement,
        canvasObjects: updatedCanvasObjects
      };
    })
}));
