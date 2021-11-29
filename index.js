const core = require("@actions/core");
const AWS = require("aws-sdk");

const ecs = new AWS.ECS();

const main = async () => {
  const cluster = core.getInput("cluster", { required: true });
  const taskDefinition = core.getInput("task-definition", { required: true });
  const subnets = core.getMultilineInput("subnets", { required: true });
  const securityGroups = core.getMultilineInput("security-groups", {
    required: true,
  });

  const taskParams = {
    taskDefinition,
    cluster,
    count: 1,
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets,
        assignPublicIp: "ENABLED",
        securityGroups,
      },
    },
  };

  try {
    core.debug("Running task...");
    let task = await ecs.runTask(taskParams).promise();
    const taskArn = task.tasks[0].taskArn;
    core.setOutput("task-arn", taskArn);

    core.debug("Waiting for task to finish...");
    await ecs
      .waitFor("tasksStopped", { cluster: "staging", tasks: [taskArn] })
      .promise();

    core.debug("Checking status of task");
    task = await ecs.describeTasks({ cluster, tasks: [taskArn] }).promise();
    const exitCode = task.tasks[0].containers[0].exitCode;

    if (exitCode === 0) {
      core.setOutput("status", "success");
    } else {
      core.setFailed(task.tasks[0].stoppedReason);

      const taskHash = taskArn.split("/").pop();
      core.info(
        `task failed, you can check the error on Amazon ECS console: https://console.aws.amazon.com/ecs/home?region=${AWS.config.region}#/clusters/${cluster}/tasks/${taskHash}/details`
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
