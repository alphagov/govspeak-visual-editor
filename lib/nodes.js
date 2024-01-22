/**
 * Glob import all nodes in the "nodes" directory
 */
const globImport = import.meta.glob('./nodes/*.js', { eager: true });

export default Object.entries(globImport).map((entry) => (entry[1]));
