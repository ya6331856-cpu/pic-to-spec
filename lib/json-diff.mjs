function jsonValueType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value === "object" ? "object" : typeof value;
}

function escapePointerSegment(value) {
  return String(value).replace(/~/g, "~0").replace(/\//g, "~1");
}

function appendPropertyPath(path, key, isArray) {
  if (isArray) return `${path}[${key}]`;
  const name = String(key);
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
    ? `${path}.${name}`
    : `${path}[${JSON.stringify(name)}]`;
}

/**
 * Structural comparison for values that have already been parsed as JSON.
 * Object property order is ignored; arrays are compared by index.
 */
export function buildJsonDiff(before, after) {
  const differences = [];

  function visit(left, right, path, pointer) {
    if (Object.is(left, right)) return;

    const leftType = jsonValueType(left);
    const rightType = jsonValueType(right);

    if (leftType === rightType && leftType === "object") {
      const leftObject = left;
      const rightObject = right;
      const leftKeys = Object.keys(leftObject);
      const rightKeys = Object.keys(rightObject);
      const keys = [
        ...leftKeys,
        ...rightKeys.filter(key => !Object.prototype.hasOwnProperty.call(leftObject, key)),
      ];

      for (const key of keys) {
        const hasLeft = Object.prototype.hasOwnProperty.call(leftObject, key);
        const hasRight = Object.prototype.hasOwnProperty.call(rightObject, key);
        const childPath = appendPropertyPath(path, key, false);
        const childPointer = `${pointer}/${escapePointerSegment(key)}`;

        if (!hasLeft) {
          differences.push({
            path: childPath,
            pointer: childPointer,
            kind: "Added",
            after: rightObject[key],
          });
        } else if (!hasRight) {
          differences.push({
            path: childPath,
            pointer: childPointer,
            kind: "Removed",
            before: leftObject[key],
          });
        } else {
          visit(leftObject[key], rightObject[key], childPath, childPointer);
        }
      }
      return;
    }

    if (leftType === rightType && leftType === "array") {
      const length = Math.max(left.length, right.length);
      for (let index = 0; index < length; index += 1) {
        const hasLeft = index < left.length;
        const hasRight = index < right.length;
        const childPath = appendPropertyPath(path, index, true);
        const childPointer = `${pointer}/${index}`;

        if (!hasLeft) {
          differences.push({
            path: childPath,
            pointer: childPointer,
            kind: "Added",
            after: right[index],
          });
        } else if (!hasRight) {
          differences.push({
            path: childPath,
            pointer: childPointer,
            kind: "Removed",
            before: left[index],
          });
        } else {
          visit(left[index], right[index], childPath, childPointer);
        }
      }
      return;
    }

    const kind = leftType === rightType ? "Changed" : "Type changed";
    differences.push({
      path,
      pointer,
      kind,
      before: left,
      after: right,
    });
  }

  visit(before, after, "$", "");
  return differences;
}

/**
 * A portable JSON report. Includes all differences, regardless of any UI filter.
 */
export function createJsonDiffReport(differences) {
  const summary = {
    total: differences.length,
    added: differences.filter(item => item.kind === "Added").length,
    removed: differences.filter(item => item.kind === "Removed").length,
    changed: differences.filter(item => item.kind === "Changed").length,
    typeChanged: differences.filter(item => item.kind === "Type changed").length,
  };

  return {
    tool: "PicToSpec JSON Diff",
    reportVersion: 1,
    comparison: "structural; object key order ignored; arrays compared by index",
    summary,
    differences,
  };
}
