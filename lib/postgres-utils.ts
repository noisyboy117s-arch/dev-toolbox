export interface ExplainNode {
  nodeType: string;
  relationName?: string;
  alias?: string;
  startupCost: number;
  totalCost: number;
  rows: number;
  width: number;
  actualStartupTime?: number;
  actualTotalTime?: number;
  actualRows?: number;
  actualLoops?: number;
  plans?: ExplainNode[];
  condition?: string;
  indexName?: string;
  indexCond?: string;
  hashCondition?: string;
  joinType?: string;
  sortMethod?: string;
  sortSpaceUsed?: number;
  heapFetches?: number;
  indexScans?: number;
  tuplesRemoved?: number;
  filter?: string;
  groupKey?: string;
  subplanName?: string;
  parallelWorkersLaunched?: number;
  workersLaunched?: number;
  workersPlanned?: number;
  workers?: ExplainNode[];
}

export interface ExplainAnalysis {
  success: boolean;
  plan?: ExplainNode;
  error?: string;
  summary?: {
    totalCost: number;
    totalRows: number;
    totalActualTime?: number;
    totalActualRows?: number;
    maxDepth: number;
    nodeTypes: Record<string, number>;
    indexesUsed: string[];
    tablesScanned: string[];
    parallelWorkers: number;
  };
}

export interface SuccessfulExplainAnalysis extends Omit<ExplainAnalysis, 'success'> {
  success: true;
  plan: ExplainNode;
  summary: NonNullable<ExplainAnalysis['summary']>;
}

export function parseExplainAnalyze(explainOutput: string): ExplainAnalysis {
  try {
    if (!explainOutput.trim()) {
      return { success: false, error: 'Empty EXPLAIN ANALYZE output' };
    }

    const lines = explainOutput.split('\n').filter(line => line.trim());
    const root = parseNode(lines, 0);
    
    if (!root) {
      return { success: false, error: 'Could not parse query plan' };
    }

    const summary = generateSummary(root);
    
    return { success: true, plan: root, summary };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to parse EXPLAIN ANALYZE output' 
    };
  }
}

export function parseExplainAnalyzeSuccess(explainOutput: string): SuccessfulExplainAnalysis | null {
  const result = parseExplainAnalyze(explainOutput);
  if (result.success && result.plan && result.summary) {
    return result as SuccessfulExplainAnalysis;
  }
  return null;
}

function parseNode(lines: string[], startIndex: number): ExplainNode | null {
  if (startIndex >= lines.length) return null;

  const line = lines[startIndex];
  const node = parseLine(line);
  
  if (!node) return null;

  let currentIndex = startIndex + 1;
  node.plans = [];

  while (currentIndex < lines.length) {
    const nextLine = lines[currentIndex];
    const indent = getIndentLevel(nextLine);
    const currentIndent = getIndentLevel(line);
    
    if (indent <= currentIndent) {
      break;
    }

    const childNode = parseNode(lines, currentIndex);
    if (childNode) {
      node.plans!.push(childNode);
      currentIndex = getNextSiblingIndex(lines, currentIndex);
    } else {
      currentIndex++;
    }
  }

  return node;
}

function parseLine(line: string): ExplainNode | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const node: ExplainNode = {
    nodeType: '',
    startupCost: 0,
    totalCost: 0,
    rows: 0,
    width: 0,
    plans: []
  };

  // Extract node type (first word before opening parenthesis)
  const nodeTypeMatch = trimmed.match(/^(\w+)/);
  if (nodeTypeMatch) {
    node.nodeType = nodeTypeMatch[1];
  }

  // Parse cost, rows, width
  const costMatch = trimmed.match(/cost=([\d.]+)\.\.([\d.]+)/);
  if (costMatch) {
    node.startupCost = parseFloat(costMatch[1]);
    node.totalCost = parseFloat(costMatch[2]);
  }

  const rowsMatch = trimmed.match(/rows=([\d.]+)/);
  if (rowsMatch) {
    node.rows = parseFloat(rowsMatch[1]);
  }

  const widthMatch = trimmed.match(/width=([\d.]+)/);
  if (widthMatch) {
    node.width = parseFloat(widthMatch[1]);
  }

  // Parse actual execution stats
  const actualTimeMatch = trimmed.match(/actual time=([\d.]+)\.\.([\d.]+)/);
  if (actualTimeMatch) {
    node.actualStartupTime = parseFloat(actualTimeMatch[1]);
    node.actualTotalTime = parseFloat(actualTimeMatch[2]);
  }

  const actualRowsMatch = trimmed.match(/actual rows=([\d.]+)/);
  if (actualRowsMatch) {
    node.actualRows = parseFloat(actualRowsMatch[1]);
  }

  const actualLoopsMatch = trimmed.match(/actual loops=([\d.]+)/);
  if (actualLoopsMatch) {
    node.actualLoops = parseFloat(actualLoopsMatch[1]);
  }

  // Parse additional properties
  const relationMatch = trimmed.match(/on ([\w.]+)/);
  if (relationMatch) {
    node.relationName = relationMatch[1];
  }

  const aliasMatch = trimmed.match(/(\w+) (\w+)/);
  if (aliasMatch && aliasMatch[1] === node.nodeType) {
    node.alias = aliasMatch[2];
  }

  const indexMatch = trimmed.match(/using ([\w.]+)/);
  if (indexMatch) {
    node.indexName = indexMatch[1];
  }

  const conditionMatch = trimmed.match(/cond: (.+?)(?:\s|$)/);
  if (conditionMatch) {
    node.condition = conditionMatch[1];
  }

  const indexCondMatch = trimmed.match(/Index Cond: (.+?)(?:\s|$)/);
  if (indexCondMatch) {
    node.indexCond = indexCondMatch[1];
  }

  const hashCondMatch = trimmed.match(/Hash Cond: (.+?)(?:\s|$)/);
  if (hashCondMatch) {
    node.hashCondition = hashCondMatch[1];
  }

  const joinTypeMatch = trimmed.match(/(\w+) Join/i);
  if (joinTypeMatch) {
    node.joinType = joinTypeMatch[1].toLowerCase();
  }

  const sortMethodMatch = trimmed.match(/Sort Method: (\w+)/);
  if (sortMethodMatch) {
    node.sortMethod = sortMethodMatch[1];
  }

  const sortSpaceMatch = trimmed.match(/sort space used: (\d+)/);
  if (sortSpaceMatch) {
    node.sortSpaceUsed = parseInt(sortSpaceMatch[1]);
  }

  const heapFetchesMatch = trimmed.match(/heap fetches: (\d+)/);
  if (heapFetchesMatch) {
    node.heapFetches = parseInt(heapFetchesMatch[1]);
  }

  const filterMatch = trimmed.match(/Filter: (.+?)(?:\s|$)/);
  if (filterMatch) {
    node.filter = filterMatch[1];
  }

  const groupKeyMatch = trimmed.match(/Group Key: (.+?)(?:\s|$)/);
  if (groupKeyMatch) {
    node.groupKey = groupKeyMatch[1];
  }

  const workersPlannedMatch = trimmed.match(/workers planned: (\d+)/);
  if (workersPlannedMatch) {
    node.workersPlanned = parseInt(workersPlannedMatch[1]);
  }

  const workersLaunchedMatch = trimmed.match(/workers launched: (\d+)/);
  if (workersLaunchedMatch) {
    node.workersLaunched = parseInt(workersLaunchedMatch[1]);
  }

  return node;
}

function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function getNextSiblingIndex(lines: string[], currentIndex: number): number {
  if (currentIndex >= lines.length) return currentIndex + 1;
  
  const currentIndent = getIndentLevel(lines[currentIndex]);
  let nextIndex = currentIndex + 1;
  
  while (nextIndex < lines.length) {
    const nextIndent = getIndentLevel(lines[nextIndex]);
    if (nextIndent <= currentIndent) {
  }
  nextIndex++;
}
  
return nextIndex;
}

export function generateSummary(root: ExplainNode): ExplainAnalysis['summary'] {
  const summary: ExplainAnalysis['summary'] = {
    totalCost: root.totalCost,
    totalRows: root.rows,
    maxDepth: 0,
    nodeTypes: {},
    indexesUsed: [],
    tablesScanned: [],
    parallelWorkers: 0
  };

  if (root.actualTotalTime !== undefined) {
    summary.totalActualTime = root.actualTotalTime;
  }
  if (root.actualRows !== undefined) {
    summary.totalActualRows = root.actualRows;
  }

  function traverse(node: ExplainNode, depth: number = 0): void {
    if (!summary) return; // Safety check
    
    summary.maxDepth = Math.max(summary.maxDepth, depth);
    
    // Count node types
    summary.nodeTypes[node.nodeType] = (summary.nodeTypes[node.nodeType] || 0) + 1;
    
    // Collect indexes
    if (node.indexName) {
      summary.indexesUsed.push(node.indexName);
    }
    
    // Collect tables
    if (node.relationName) {
      summary.tablesScanned.push(node.relationName);
    }
    
    // Count parallel workers
    if (node.workersLaunched !== undefined) {
      summary.parallelWorkers += node.workersLaunched;
    }
    
    // Traverse children
    if (node.plans) {
      node.plans.forEach(child => traverse(child, depth + 1));
    }
  }

  traverse(root);

  // Remove duplicates
  summary.indexesUsed = [...new Set(summary.indexesUsed)];
  summary.tablesScanned = [...new Set(summary.tablesScanned)];

  return summary;
}

export function explainNodeType(nodeType: string): string {
  const explanations: Record<string, string> = {
    'Seq Scan': 'Sequential Scan - Reads all rows in the table in order. Expensive for large tables without filters.',
    'Index Scan': 'Index Scan - Uses an index to find specific rows. Efficient for selective queries.',
    'Index Only Scan': 'Index Only Scan - Reads only from the index without touching the table. Most efficient when possible.',
    'Bitmap Heap Scan': 'Bitmap Heap Scan - Uses a bitmap to find matching rows, then fetches from the table. Good for selective queries on large tables.',
    'Bitmap Index Scan': 'Bitmap Index Scan - Creates a bitmap of matching rows from an index. Often used with Bitmap Heap Scan.',
    'Nested Loop': 'Nested Loop Join - For each row in the outer table, finds matching rows in the inner table. Efficient for small datasets or indexed joins.',
    'Hash Join': 'Hash Join - Builds a hash table of the inner table and probes it for each outer row. Efficient for large, unsorted datasets.',
    'Merge Join': 'Merge Join - Joins two sorted inputs. Very efficient when both inputs are already sorted.',
    'Sort': 'Sort - Sorts the result set. Required for ORDER BY, DISTINCT, or some join operations.',
    'Hash Aggregate': 'Hash Aggregate - Groups rows using a hash table. Used for GROUP BY operations.',
    'Limit': 'Limit - Limits the number of rows returned. Often stops execution early.',
    'Aggregate': 'Aggregate - Performs aggregate functions like COUNT, SUM, AVG, etc.',
    'Unique': 'Unique - Removes duplicate rows. Used for DISTINCT or some join operations.',
    'Gather': 'Gather - Collects results from parallel workers. Part of parallel query execution.',
    'Gather Merge': 'Gather Merge - Collects and merges sorted results from parallel workers.',
    'Materialize': 'Materialize - Stores intermediate results that might be needed multiple times.',
    'CTE Scan': 'CTE Scan - Scans a Common Table Expression result.',
    'Subquery Scan': 'Subquery Scan - Scans the result of a subquery.',
    'Function Scan': 'Function Scan - Returns rows from a set-returning function.',
    'Values Scan': 'Values Scan - Scans a VALUES clause.',
    'Result': 'Result - Returns a single row or constant values.'
  };

  return explanations[nodeType] || `${nodeType} - A query plan operation node.`;
}

export function getPerformanceTips(node: ExplainNode): string[] {
  const tips: string[] = [];

  // Check for sequential scans
  if (node.nodeType === 'Seq Scan' && node.rows > 1000) {
    tips.push('⚠️ Large sequential scan detected. Consider adding an index on the filtered columns.');
  }

  // Check for high cost operations
  if (node.totalCost > 1000) {
    tips.push(`⚠️ High cost operation (${node.totalCost.toFixed(2)}). Consider optimization.`);
  }

  // Check for row estimation errors
  if (node.actualRows && node.rows) {
    const ratio = node.actualRows / node.rows;
    if (ratio > 10 || ratio < 0.1) {
      tips.push(`⚠️ Poor row estimation: planned ${node.rows}, actual ${node.actualRows}. Consider ANALYZE.`);
    }
  }

  // Check for sort operations
  if (node.nodeType === 'Sort' && node.sortSpaceUsed && node.sortSpaceUsed > 1000) {
    tips.push(`⚠️ Large sort operation (${node.sortSpaceUsed}KB). Consider adding an index to avoid sorting.`);
  }

  // Check for hash joins
  if (node.nodeType === 'Hash Join' && node.actualTotalTime && node.actualTotalTime > 100) {
    tips.push('⚠️ Slow hash join. Check if join columns are indexed and consider work_mem.');
  }

  // Check for nested loops with many rows
  if (node.nodeType === 'Nested Loop' && node.actualRows && node.actualRows > 10000) {
    tips.push('⚠️ Nested loop with many rows. Ensure inner table has proper indexes.');
  }

  // Check for parallel workers
  if (node.workersPlanned === 0 && node.totalCost > 10000) {
    tips.push('💡 Consider enabling parallel query execution for this expensive query.');
  }

  return tips;
}

export function formatCost(cost: number): string {
  if (cost < 0.01) return cost.toFixed(4);
  if (cost < 1) return cost.toFixed(2);
  if (cost < 100) return cost.toFixed(1);
  return cost.toFixed(0);
}

export function formatTime(time: number): string {
  if (time < 0.001) return `${(time * 1000).toFixed(2)}ms`;
  if (time < 1) return `${(time * 1000).toFixed(1)}ms`;
  return `${time.toFixed(3)}s`;
}
