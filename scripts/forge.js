import { execSync } from 'child_process';
const PROCESS_ALLOWED = ['build', 'dev', 'types', 'lint'];
const PROJECTS_ALLOWED = {
    client: 'client',
    server: 'server',
    shared: 'shared',
    ui: 'packages/lifeforge-ui',
    'apps:localization-manager': 'apps/localization-manager',
    'apps:docs': 'apps/docs',
    'apps:api-builder': 'apps/api-builder',
    'apps:api-explorer': 'apps/api-explorer'
};
const processType = process.argv[2];
const projectTypes = process.argv.slice(3);
if (!PROCESS_ALLOWED.includes(processType)) {
    console.error(`Invalid process type: ${processType}. Allowed types are: ${PROCESS_ALLOWED.join(', ')}`);
    process.exit(1);
}
if (!projectTypes.every(projectType => Object.keys(PROJECTS_ALLOWED).includes(projectType))) {
    console.error(`Invalid project type: ${projectTypes.find(projectType => !Object.keys(PROJECTS_ALLOWED).includes(projectType))}. Allowed projects are: ${Object.keys(PROJECTS_ALLOWED).join(', ')}`);
    process.exit(1);
}
const commands = projectTypes.map(projectType => `cd ${PROJECTS_ALLOWED[projectType]} && bun run ${processType}`);
const finalCommand = `concurrently --kill-others --success first --prefix-name "${projectTypes.join(',')}" --names "${projectTypes.join(',')}" --prefix-colors "${projectTypes.map(() => 'cyan').join(',')}" ${commands.map(cmd => `"${cmd}"`).join(' ')}`;
try {
    console.log(`Executing command: ${finalCommand}`);
    execSync(finalCommand, { stdio: 'inherit' });
    console.log(`${processType.charAt(0).toUpperCase() + processType.slice(1)} completed successfully for ${projectTypes.join(', ')}.`);
}
catch (error) {
    console.error(`${processType.charAt(0).toUpperCase() + processType.slice(1)} failed for ${projectTypes.join(', ')}.`);
    console.error(error);
    process.exit(1);
}
