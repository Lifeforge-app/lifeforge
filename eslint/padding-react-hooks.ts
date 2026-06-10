import type { Rule } from 'eslint'
import type { TSESTree } from '@typescript-eslint/utils'

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce padding lines between and around React hook calls.',
      category: 'Stylistic Issues'
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      noBlankLineBetweenHooks: 'Expected no blank line between hook calls.',
      blankLineRequiredAfterHook: 'Expected blank line after hook calls.',
      blankLineRequiredBeforeHook: 'Expected blank line before hook calls.',
      blankLineRequiredBetweenConsts: 'Expected blank line between const declarations.'
    }
  },
  create(context) {
    const sourceCode = context.sourceCode;

    function isHookCall(node: any): boolean {
      if (!node || node.type !== 'CallExpression') return false;
      const callee = node.callee;
      if (callee.type === 'Identifier') {
        return /^use[A-Z]/.test(callee.name);
      }
      if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
        return /^use[A-Z]/.test(callee.property.name);
      }
      return false;
    }

    function isHookStatement(statement: TSESTree.Statement): boolean {
      if (statement.type === 'ExpressionStatement') {
        return isHookCall((statement as TSESTree.ExpressionStatement).expression);
      }
      if (statement.type === 'VariableDeclaration') {
        return (statement as TSESTree.VariableDeclaration).declarations.some(decl => isHookCall(decl.init));
      }
      return false;
    }

    function isConstDeclaration(statement: TSESTree.Statement): boolean {
      return statement.type === 'VariableDeclaration' && (statement as TSESTree.VariableDeclaration).kind === 'const';
    }

    function hasBlankLineBetween(startLine: number, endLine: number): boolean {
      for (let line = startLine + 1; line < endLine; line++) {
        const lineText = sourceCode.lines[line - 1];
        if (lineText.trim() === '') {
          return true;
        }
      }
      return false;
    }

    function checkStatements(statements: TSESTree.Statement[]) {
      for (let i = 0; i < statements.length - 1; i++) {
        const current = statements[i];
        const next = statements[i + 1];

        const currentIsHook = isHookStatement(current);
        const nextIsHook = isHookStatement(next);

        const currentIsConst = isConstDeclaration(current);
        const nextIsConst = isConstDeclaration(next);

        const currentIsExpr = current.type === 'ExpressionStatement';
        const nextIsExpr = next.type === 'ExpressionStatement';

        const currentEndLine = current.loc?.end.line;
        const nextStartLine = next.loc?.start.line;
        if (currentEndLine === undefined || nextStartLine === undefined) continue;

        if (currentIsHook && nextIsHook) {
          if (hasBlankLineBetween(currentEndLine, nextStartLine)) {
            context.report({
              node: next as any,
              messageId: 'noBlankLineBetweenHooks',
              fix(fixer) {
                const rangeStart = current.range?.[1];
                const rangeEnd = next.range?.[0];
                if (rangeStart === undefined || rangeEnd === undefined) return null;
                const textBetween = sourceCode.text.slice(rangeStart, rangeEnd);
                const fixedText = textBetween.replace(/\r?\n\s*\r?\n/g, '\n');
                return fixer.replaceTextRange([rangeStart, rangeEnd], fixedText);
              }
            });
          }
        } else if (currentIsHook && (nextIsConst || nextIsExpr)) {
          if (!hasBlankLineBetween(currentEndLine, nextStartLine)) {
            context.report({
              node: next as any,
              messageId: 'blankLineRequiredAfterHook',
              fix(fixer) {
                return fixer.insertTextBefore(next as any, '\n');
              }
            });
          }
        } else if ((currentIsConst || currentIsExpr) && nextIsHook) {
          if (!hasBlankLineBetween(currentEndLine, nextStartLine)) {
            context.report({
              node: next as any,
              messageId: 'blankLineRequiredBeforeHook',
              fix(fixer) {
                return fixer.insertTextBefore(next as any, '\n');
              }
            });
          }
        } else if (currentIsConst && (nextIsConst || nextIsExpr)) {
          if (!hasBlankLineBetween(currentEndLine, nextStartLine)) {
            context.report({
              node: next as any,
              messageId: 'blankLineRequiredBetweenConsts',
              fix(fixer) {
                return fixer.insertTextBefore(next as any, '\n');
              }
            });
          }
        } else if (currentIsExpr && nextIsConst) {
          if (!hasBlankLineBetween(currentEndLine, nextStartLine)) {
            context.report({
              node: next as any,
              messageId: 'blankLineRequiredBetweenConsts',
              fix(fixer) {
                return fixer.insertTextBefore(next as any, '\n');
              }
            });
          }
        }
      }
    }

    return {
      BlockStatement(node: any) {
        checkStatements(node.body);
      },
      Program(node: any) {
        checkStatements(node.body);
      }
    };
  }
}

export default rule;
