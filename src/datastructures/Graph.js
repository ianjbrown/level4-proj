import { Random } from "random-js";
import PriorityQueue from "./PriorityQueue.js";
import UnionFind from "./UnionFind.js";
// create a graph class
class Graph {
  // constructor
  // initialize no of vertices at 0 and adjacencylist as an empty map
  constructor(noOfVertices) {
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
  }

  setNoOfVertices(noOfVertices) {
    this.noOfVertices = noOfVertices;
  }

  // adds vertex v and map to a null array
  addVertex(v) {
    this.AdjList.set(v, []);
    //this.state.noOfVertices += 1;
  }

  getEdgeCount() {
    let count = 0;
    for (const [key, value] of this.AdjList.entries()) {
      count += value.length;
    }
    return count / 2;
  }

  // add edge to each others adjacency lists since undirected graph
  addEdge(u, v, weight) {
    let uAdjList = this.AdjList.get(u);
    let vAdjList = this.AdjList.get(v);

    if (uAdjList === undefined || vAdjList === undefined) return false;
    // no duplicate edges
    for (var i in uAdjList) if (uAdjList[i].node === v) return false;

    // no self-connecting edges
    if (u === v) return false;
    // undirected graph so push onto both
    // if (uAdjList === undefined)
    // // console.log(uAdjList.size);
    // // console.log(vAdjList);
    uAdjList.push({
      node: v,
      weight: weight,
    });
    vAdjList.push({
      node: u,
      weight: weight,
    });
    return true;
  }

  /* this is really just a depth first search that returns
    true if we can visit all vertices (graph is connected)*/
  isConnected(startingNode) {
    var visited = {};
    this.isConnectedUtil(startingNode, visited);
    // // console.log(visited);
    // // console.log(Object.keys(visited));
    if (Object.keys(visited).length < this.noOfVertices) {
      return false;
    } else {
      return true;
    }
  }

  // recursive function for above
  isConnectedUtil(vert, visited) {
    visited[vert] = true;

    var get_neighbours = this.AdjList.get(vert);
    for (var i in get_neighbours) {
      var get_elem = get_neighbours[i].node;
      if (!visited[get_elem]) {
        this.isConnectedUtil(get_elem, visited);
      }
    }
  }

  toString() {
    // get all vertices
    var get_keys = this.AdjList.keys();

    var outerConc = [];
    var edgeCount = 0;
    // iterate over vertices
    for (var i of get_keys) {
      // get corresponsing adjacency list
      var get_values = this.AdjList.get(i);
      var conc = "";

      // iterate over adjacency list
      // concatenate the values into a string
      for (var j of get_values) {
        conc += "{ node = " + j.node + ", weight = " + j.weight + "}";
        edgeCount++;
      }

      // print the vertex and its adjacency list
      outerConc.push(i + " -> " + conc);
    }
    outerConc.push(
      "This Graph has " +
        this.noOfVertices +
        " vertices and " +
        edgeCount / 2 +
        " edges"
    );
    if (edgeCount / 2 === this.noOfVertices - 1) {
      outerConc.push(
        "This Graph is an MST because it has n-1 (" + edgeCount / 2 + ") edges"
      );
    }
    // //console.log(this.AdjList);
    return outerConc;
  }

  generateGraph(lines) {
    const random = new Random();
    for (var i = 0; i < this.noOfVertices; i++) {
      this.addVertex(i);
    }

    for (i = 0; i < lines.length; i++) {
      const edge = lines[i].split(",")
      this.addEdge(parseInt(edge[0]), parseInt(edge[1]), random.integer(1,30));
    }

  }

  generateRandomGraph() {
    const random = new Random();
    let edges = 0;

    this.AdjList.clear();

    //Add the vertices
    for (var i = 0; i < this.noOfVertices; i++) {
      this.addVertex(i);
    }

    //Add edges until we have a connected graph
    while (!this.isConnected(0)) {
      //const edges = random.integer(1,)
      let edge = [
        random.integer(0, this.noOfVertices - 1),
        random.integer(0, this.noOfVertices - 1),
        random.integer(1, 30),
      ];
      // if (this.AdjList.get(edge[0]).length > 2) continue;
      // if (this.AdjList.get(edge[1]).length > 2) continue;
      // console.log(JSON.stringify(this.AdjList.get(edge[0])));
      // console.log(this.AdjList.get(edge[0]).length);
      let added = this.addEdge(edge[0], edge[1], edge[2]);
      if (added) edges++;
    }
    console.log(edges);
    let moreEdges;
    if (edges === this.noOfVertices - 1) {
      console.log("HEY THERE");
      console.log(this.noOfVertices);
      switch (this.noOfVertices) {
        case "5":
          moreEdges = 6;
          break;
        case "6":
          moreEdges = 8;
          break;
        case "7":
          moreEdges = 10;
          break;
        case "8":
          moreEdges = 12;
          break;
        case "9":
          moreEdges = 14;
          break;
        case "10":
          moreEdges = 16;
      }
    }

    while (edges < moreEdges) {
      let wasAdded = this.addEdge(
        random.integer(0, this.noOfVertices - 1),
        random.integer(0, this.noOfVertices - 1),
        random.integer(1, 30)
      );
      if (wasAdded) edges++;
    }
  }

  importGraph(lines) {
    //add the vertices
    for (var i = 0; i < this.noOfVertices; i++) {
      this.addVertex(i);
    }

    //add the edges
    for (i = 0; i < lines.length; i++) {
      const edge = lines[i].split(",");
      this.addEdge(parseInt(edge[0]), parseInt(edge[1]), parseInt(edge[2]));
    }
  }

  kruskal() {
    // Create new graph for MST and priority queue for edges sorted by weight
    // create union-find/disjoint-sets data structure to help check for introduction of cycles
    var edgeCompSequence = [];
    var edgesQueues = [];
    var minWeight = 0;
    var edgeSequence = [];
    const MST = new Graph(this.noOfVertices);
    var edgesQueue = new PriorityQueue();
    // console.log(this.AdjList);
    let uf = new UnionFind(this.AdjList);
    var ufs = [uf];

    // Add vertices to MST
    for (var i = 0; i < this.noOfVertices; i++) {
      MST.addVertex(i);
    }
    MST.setNoOfVertices(MST.AdjList.size);
    // Add edges to priority queue
    for (const element of this.AdjList) {
      for (const adjacent of element[1]) {
        edgesQueue.enqueue([element[0], adjacent.node], adjacent.weight);
      }
    }
    edgesQueues.push(Object.assign([], edgesQueue.items));

    while (!edgesQueue.isEmpty()) {
      if (MST.getEdgeCount() === this.noOfVertices - 1) {
        console.log("Terminate early");
        break;
      }
      const nextEdge = edgesQueue.dequeue();
      const vertices = nextEdge.elem;
      const weight = nextEdge.prio;
      ufs.push(uf);

      //if adding edge would not create cycle, add edge to MST
      if (!uf.connected(vertices[0], vertices[1])) {
        minWeight += weight;
        MST.addEdge(vertices[0], vertices[1], weight);
        uf.union(vertices[0], vertices[1]);
        edgeSequence.push([vertices[0], vertices[1], weight]);
      }
      edgesQueues.push(Object.assign([], edgesQueue.items));
      edgeCompSequence.push(nextEdge);
    }
    // console.log(minWeight);
    return [MST, edgeSequence, edgesQueues, minWeight, edgeCompSequence];
  }

  prim(startingVertexString) {
    var edgesQueues = [];
    var visiteds = [];
    var minWeight = 0;
    var startingVertex = parseInt(startingVertexString);
    /* create data structures... new graph for MST, 
    queue for edges sorted by weight, and array of visited vertices */
    var edgeSequence = [];
    var edgeCompSequence = [];
    const MST = new Graph(this.noOfVertices);
    var edgesQueue = new PriorityQueue();
    var visited = [];
    // console.log(JSON.stringify(visited));

    //begin with first node (0)
    visited.push(startingVertex);
    // console.log(JSON.stringify(visited));
    MST.addVertex(startingVertex);
    // console.log(startingVertex);
    // console.log(this.AdjList);
    // add edges of the starting node to queue
    for (const adjacent of this.AdjList.get(parseInt(startingVertex))) {
      edgesQueue.enqueue([startingVertex, adjacent.node], adjacent.weight);
    }
    visiteds.push(Object.assign([], visited));
    edgesQueues.push(Object.assign([], edgesQueue.items));
    // console.log("EDGES QUEUE = " + JSON.stringify(edgesQueue));
    // while we have not visited all vertices
    while (visited.length < this.noOfVertices) {
      // pick edge with the lowest weight
      let nextEdge = edgesQueue.dequeue();

      // the connected vertex
      let nextNode = nextEdge.elem[1];

      // if not visited yet, add to MST
      if (!visited.includes(nextNode)) {
        MST.addVertex(nextNode);
        MST.addEdge(nextEdge.elem[0], nextNode, nextEdge.prio);
        minWeight += nextEdge.prio;
        edgeSequence.push([nextEdge.elem[0], nextNode, nextEdge.prio]);

        // add edges of new node to queue
        for (const adjacent of this.AdjList.get(nextNode)) {
          if (adjacent.node === nextEdge.elem[0]) continue;
          edgesQueue.enqueue([nextNode, adjacent.node], adjacent.weight);
        }

        // mark as visited
        visited.push(nextNode);
        // console.log(visited);
      }
      visiteds.push(Object.assign([], visited));
      edgesQueues.push(Object.assign([], edgesQueue.items));
      edgeCompSequence.push(nextEdge);

      MST.setNoOfVertices(MST.AdjList.size);
      // console.log(JSON.stringify(visiteds));
      // console.log(edgeSequence);
    }
    // visiteds.push(Object.assign([], visited));
    return [
      MST,
      edgeSequence,
      edgesQueues,
      visiteds,
      minWeight,
      edgeCompSequence,
    ];
  }

  // this helper function allows us to sort adjlists by numerical node value
  compareAdjListEntry(x, y) {
    if (x.node < y.node) {
      return -1;
    }
    if (x.node > y.node) {
      return 1;
    }
    return 0;
  }

  compareObjects(x, y) {
    for (var property in x) {
      if (x[property] !== y[property]) {
        return false;
      }
    }
    return true;
  }

  compareAdjLists(kruskalList, primList) {
    var testVal;
    if (kruskalList.size !== primList.size) {
      return false;
    }
    for (var [key, val] of kruskalList) {
      testVal = primList.get(key);
      if (!primList.has(key) || testVal.length !== val.length) {
        return false;
      }
      val.sort(this.compareAdjListEntry);
      testVal.sort(this.compareAdjListEntry);

      for (var i = 0; i < val.length; i++) {
        if (!this.compareObjects(val[i], testVal[i])) {
          return false;
        }
      }
    }
    return true;
  }

  testAlgorithms(testNumber) {
    // const random = new Random();
    var passedTests = 0;
    var printCounter = 0;
    for (var test = 0; test < testNumber; test++, printCounter++) {
      if (printCounter === testNumber / 10) {
        // console.log("Beginning test " + test);
        printCounter = 0;
      }
      // if (printCounter === testNumber / 20) console.log("...");
      //var v = random.integer(5, 15);
      //this.setNoOfVertices(v);
      this.generateGraph();
      // //console.log(this.toString());
      var kruskal = this.kruskal();
      var prim = this.prim();
      if (this.compareAdjLists(kruskal.AdjList, prim.AdjList)) {
        passedTests++;
      }
    }
    // console.log(passedTests + " matches");
    // console.log(testNumber - passedTests + " differences");
    // console.log("Match rate of " + (passedTests / testNumber) * 100 + "%");
  }
}
export default Graph;