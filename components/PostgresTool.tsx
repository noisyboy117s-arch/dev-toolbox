'use client';

import React, { useState, useEffect } from 'react';
import { 
  parseExplainAnalyze, 
  explainNodeType, 
  getPerformanceTips, 
  formatCost, 
  formatTime,
  ExplainNode,
  ExplainAnalysis 
} from '@/lib/postgres-utils';

export default function PostgresTool() {
  const [explainOutput, setExplainOutput] = useState('');
  const [analysis, setAnalysis] = useState<ExplainAnalysis | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (explainOutput.trim()) {
      const result = parseExplainAnalyze(explainOutput);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [explainOutput]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const clearAll = () => {
    setExplainOutput('');
    setAnalysis(null);
    setCopySuccess('');
    setExpandedNodes(new Set());
  };

  const loadSampleExplain = () => {
    setExplainOutput(`Hash Join  (cost=34.28..70.30 rows=860 width=72) (actual time=1.254..2.887 rows=1000 loops=1)
  Hash Cond: (o.customer_id = c.id)
  ->  Seq Scan on orders o  (cost=0.00..32.60 rows=2260 width=36) (actual time=0.012..0.764 rows=1000 loops=1)
        Filter: (order_date >= '2023-01-01'::date)
        Rows Removed by Filter: 9000
  ->  Hash  (cost=22.50..22.50 rows=1250 width=40) (actual time=1.212..1.213 rows=1000 loops=1)
        Buckets: 2048  Batches: 1  Memory Usage: 97kB
        ->  Seq Scan on customers c  (cost=0.00..22.50 rows=1250 width=40) (actual time=0.008..0.578 rows=1000 loops=1)
              Filter: (active = true)
              Rows Removed by Filter: 500
Planning Time: 0.145 ms
Execution Time: 3.012 ms`);
  };

  const loadComplexSample = () => {
    setExplainOutput(`Gather  (cost=1000.00..115025.55 rows=1 width=141) (actual time=12.456..125.789 rows=1000 loops=1)
  Workers Planned: 4
  Workers Launched: 4
  ->  Nested Loop  (cost=0.00..114025.45 rows=1 width=141) (actual time=8.234..120.456 rows=200 loops=5)
        Join Filter: (p.category_id = c.id)
        ->  Index Scan using idx_products_created_at on products p  (cost=0.42..850.25 rows=200 width=100) (actual time=0.123..45.678 rows=200 loops=5)
              Index Cond: (created_at >= '2023-01-01'::date)
              Filter: (price > 100.00)
              Rows Removed by Filter: 1800
        ->  Materialize  (cost=0.00..25.50 rows=500 width=45) (actual time=0.001..0.002 rows=50 loops=1000)
              ->  Index Scan using idx_categories_active on categories c  (cost=0.28..15.25 rows=500 width=45) (actual time=0.012..0.045 rows=50 loops=5)
                    Index Cond: (active = true)
Planning Time: 2.345 ms
Execution Time: 126.890 ms`);
  };

  const renderPlanNode = (node: ExplainNode, depth: number = 0, nodeId: string = 'root'): React.ReactElement => {
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.plans && node.plans.length > 0;
    const tips = getPerformanceTips(node);

    return (
      <div key={nodeId} className="border-l-2 border-gray-300 dark:border-gray-600 ml-4">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg mb-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggleNode(nodeId)}
                  className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {node.nodeType}
              </span>
              {node.relationName && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  on {node.relationName}
                </span>
              )}
              {node.alias && (
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  ({node.alias})
                </span>
              )}
            </div>
            <button
              onClick={() => copyToClipboard(`${node.nodeType}: ${JSON.stringify(node, null, 2)}`, nodeId)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                copySuccess === nodeId
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {copySuccess === nodeId ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Cost Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-2">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Cost:</span>
              <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                {formatCost(node.startupCost)}..{formatCost(node.totalCost)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Rows:</span>
              <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                {node.rows.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Width:</span>
              <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                {node.width}
              </span>
            </div>
            {node.actualTotalTime !== undefined && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Time:</span>
                <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                  {formatTime(node.actualTotalTime)}
                </span>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="text-xs space-y-1">
            {node.actualRows !== undefined && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Actual Rows:</span>
                <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                  {node.actualRows.toLocaleString()}
                </span>
              </div>
            )}
            {node.indexName && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Index:</span>
                <span className="ml-1 font-mono text-green-600 dark:text-green-400">
                  {node.indexName}
                </span>
              </div>
            )}
            {node.condition && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Condition:</span>
                <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                  {node.condition}
                </span>
              </div>
            )}
            {node.indexCond && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Index Cond:</span>
                <span className="ml-1 font-mono text-green-600 dark:text-green-400">
                  {node.indexCond}
                </span>
              </div>
            )}
            {node.hashCondition && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Hash Cond:</span>
                <span className="ml-1 font-mono text-purple-600 dark:text-purple-400">
                  {node.hashCondition}
                </span>
              </div>
            )}
            {node.filter && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Filter:</span>
                <span className="ml-1 font-mono text-orange-600 dark:text-orange-400">
                  {node.filter}
                </span>
              </div>
            )}
            {node.sortMethod && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Sort Method:</span>
                <span className="ml-1 font-mono text-gray-900 dark:text-gray-100">
                  {node.sortMethod}
                </span>
              </div>
            )}
            {node.workersPlanned !== undefined && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Workers:</span>
                <span className="ml-1 font-mono text-blue-600 dark:text-blue-400">
                  {node.workersLaunched || 0}/{node.workersPlanned}
                </span>
              </div>
            )}
          </div>

          {/* Performance Tips */}
          {tips.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">Performance Tips:</div>
              {tips.map((tip, index) => (
                <div key={index} className="text-xs text-yellow-700 dark:text-yellow-300">
                  {tip}
                </div>
              ))}
            </div>
          )}

          {/* Node Explanation */}
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-800 dark:text-blue-200">
              {explainNodeType(node.nodeType)}
            </div>
          </div>
        </div>

        {/* Child Nodes */}
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.plans!.map((child, index) => 
              renderPlanNode(child, depth + 1, `${nodeId}-${index}`)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Postgres EXPLAIN ANALYZE Explainer</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Parse and understand PostgreSQL query execution plans with performance analysis and optimization tips.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              EXPLAIN ANALYZE Output
            </label>
            {explainOutput && (
              <button
                onClick={() => copyToClipboard(explainOutput, 'input')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'input'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'input' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={explainOutput}
            onChange={(e) => setExplainOutput(e.target.value)}
            placeholder="Paste your EXPLAIN ANALYZE output here..."
            className="w-full h-96 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          
          {/* Sample Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={loadSampleExplain}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Load Sample
            </button>
            <button
              onClick={loadComplexSample}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Load Complex Sample
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Analysis Section */}
        <div>
          {analysis ? (
            <>
              {analysis.success ? (
                <>
                  {/* Summary */}
                  {analysis.summary && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">Query Summary</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-green-700 dark:text-green-300">Total Cost:</span>
                          <span className="ml-2 font-mono text-green-900 dark:text-green-100">
                            {formatCost(analysis.summary.totalCost)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-700 dark:text-green-300">Total Rows:</span>
                          <span className="ml-2 font-mono text-green-900 dark:text-green-100">
                            {analysis.summary.totalRows.toLocaleString()}
                          </span>
                        </div>
                        {analysis.summary.totalActualTime && (
                          <div>
                            <span className="text-green-700 dark:text-green-300">Execution Time:</span>
                            <span className="ml-2 font-mono text-green-900 dark:text-green-100">
                              {formatTime(analysis.summary.totalActualTime)}
                            </span>
                          </div>
                        )}
                        {analysis.summary.totalActualRows && (
                          <div>
                            <span className="text-green-700 dark:text-green-300">Actual Rows:</span>
                            <span className="ml-2 font-mono text-green-900 dark:text-green-100">
                              {analysis.summary.totalActualRows.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-green-700 dark:text-green-300">Max Depth:</span>
                          <span className="ml-2 font-mono text-green-900 dark:text-green-100">
                            {analysis.summary.maxDepth}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-700 dark:text-green-300">Parallel Workers:</span>
                          <span className="ml-2 font-mono text-green-900 dark:text-green-100">
                            {analysis.summary.parallelWorkers}
                          </span>
                        </div>
                      </div>
                      
                      {/* Node Types */}
                      <div className="mt-3">
                        <span className="text-green-700 dark:text-green-300 text-sm">Node Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(analysis.summary.nodeTypes).map(([type, count]) => (
                            <span key={type} className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded">
                              {type} ({count})
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Indexes Used */}
                      {analysis.summary.indexesUsed.length > 0 && (
                        <div className="mt-3">
                          <span className="text-green-700 dark:text-green-300 text-sm">Indexes Used:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.summary.indexesUsed.map(index => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {index}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Tables Scanned */}
                      {analysis.summary.tablesScanned.length > 0 && (
                        <div className="mt-3">
                          <span className="text-green-700 dark:text-green-300 text-sm">Tables Scanned:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.summary.tablesScanned.map(table => (
                              <span key={table} className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded">
                                {table}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Query Plan */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Query Execution Plan</h3>
                      <button
                        onClick={() => setExpandedNodes(new Set(['root']))}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Expand All
                      </button>
                    </div>
                    <div className="max-h-96 overflow-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      {analysis.plan && renderPlanNode(analysis.plan)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Parse Error</h3>
                  <p className="text-red-800 dark:text-red-200 text-sm">{analysis.error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">📊</div>
              <p>Enter EXPLAIN ANALYZE output to see the analysis</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to Use</h3>
        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <p><strong>1.</strong> Run <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">EXPLAIN ANALYZE your_query;</code> in PostgreSQL</p>
          <p><strong>2.</strong> Copy the entire output including all lines</p>
          <p><strong>3.</strong> Paste it in the input area above</p>
          <p><strong>4.</strong> Click on nodes to expand/collapse child operations</p>
          <p><strong>5.</strong> Review performance tips and optimization suggestions</p>
        </div>
      </div>
    </div>
  );
}
