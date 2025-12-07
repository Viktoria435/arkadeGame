export enum Action {
    Left = "Left",
    FastDrop = "FastDrop",
    Pause = "Pause",
    Quit = "Quit",
    Right = "Right",
    Rotate = "Rotate",
    SlowDrop = "SlowDrop",
  }
  
  export const Key: Record<string, Action> = {
    ArrowUp: Action.Rotate,
    ArrowDown: Action.SlowDrop,
    ArrowLeft: Action.Left,
    ArrowRight: Action.Right,
    KeyQ: Action.Quit,
    KeyP: Action.Pause,
    Space: Action.FastDrop,
  };
  
  export const actionIsDrop = (action: Action) =>
    [Action.SlowDrop, Action.FastDrop].includes(action);
  
  export const actionForKey = (keyCode: string): Action | undefined => Key[keyCode];
  