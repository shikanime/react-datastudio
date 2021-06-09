import {
  FilterInteractionData,
  getHeight,
  getWidth,
  InteractionId,
  InteractionType,
  Message,
  ObjectFormat,
  objectTransform,
  sendInteraction,
  subscribeToData,
  TableFormat,
  tableTransform
} from "@google/dscc";
import { useDebounce } from "@react-hook/debounce";
import { useEffect } from "react";

export interface VisualizationSizeOptions {
  wait?: number;
  leading?: boolean;
}

const getSize = () => [getWidth(), getHeight()] as const;

export const useDataStudioVisualizationSize = (
  options: VisualizationSizeOptions = {}
): readonly [number, number] => {
  const { wait, leading } = options;
  const object = useDataStudioObjectTransform();
  const [size, setDebouncedSize] = useDebounce<readonly [number, number]>(
    getSize,
    wait,
    leading
  );

  useEffect(() => {
    setDebouncedSize(getSize);
  }, [object]);

  return size;
};

export interface TransformOptions<T> {
  wait?: number;
  leading?: boolean;
  transform: (message: Message) => T;
}

export function useDataStudioTransform<T>(options: TransformOptions<T>) {
  const { wait, leading, transform } = options;
  const [objFmt, setObjFmt] = useDebounce<T | null>(null, wait, leading);

  useEffect(() => {
    return subscribeToData(
      (data) => {
        setObjFmt(() => data);
      },
      { transform }
    );
  }, [transform]);

  return objFmt;
}

export function useDataStudioObjectTransform(
  options: Omit<TransformOptions<ObjectFormat>, "transform"> = {}
) {
  return useDataStudioTransform({ ...options, transform: objectTransform });
}

export function useDataStudioTableTransform(
  options: Omit<TransformOptions<TableFormat>, "transform"> = {}
) {
  return useDataStudioTransform({ ...options, transform: tableTransform });
}

export function useDataStudioFilterInteraction(id: InteractionId) {
  return (data: FilterInteractionData) => {
    sendInteraction(id, InteractionType.FILTER, data);
  };
}