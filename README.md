# AWS ECS Run Task

Runs a one-off task on AWS ECS Fargate.

Usage
``` yaml
- name: Run migration
  uses: noelzubin/aws-ces-run-task@1.0
  with:
	cluster: staging
	task-defintion: run_migration_task_def
	subnets: ${{ secrets.SUBNETS }}
	security-groups: ${{ secrets.SECURITY_GROUPS }}
```
See [aciton.yml](action.yml) file for the full documentation for this action's inputs and outputs.

Note: the `task-definition` input requires the name of the task-defintion. If you need to use task-definition input files, consider creating other actions to create the task defintion first.  

## Credentials and Region

This action relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) to determine AWS credentials and region.
Use [the `aws-actions/configure-aws-credentials` action](https://github.com/aws-actions/configure-aws-credentials) to configure the GitHub Actions environment with environment variables containing AWS credentials and your desired region.

## License Summary

This code is made available under the MIT license.