declare var FlowChart: {

    setContainer(id: string): void;

    addNode(position:any, elId:any): void;

    undo(): void;

    init(): void;

    zoomIn(): void;

    zoomOut(): void;

    loadData(data:any): void;

    getModelData(): void;

    getNodeParams(nodeId:string):void;

    setNodeParams(nodeId:string, params:any):void;

    getNode(nodeId:string):void;

    // runModel():void;

    on(eventName:string, fn:Function):void;

    use(plugin: Function, ...args: any[]): void;

    [key: string]: any; // 插件扩展
  }

export default FlowChart
