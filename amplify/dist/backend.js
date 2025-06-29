import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
// Define the Bedrock function (replaces your local proxy server)
const bedrockFunction = defineFunction({
    name: 'bedrock-chat',
    entry: './functions/bedrock-chat/handler.ts',
    environment: {
        BEDROCK_REGION: 'us-west-2'
    }
});
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    bedrockFunction
});
// Grant Bedrock permissions to the function
backend.bedrockFunction.resources.lambda.addToRolePolicy(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream'
    ],
    resources: [
        'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0'
    ]
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTlELGlFQUFpRTtBQUNqRSxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDckMsSUFBSSxFQUFFLGNBQWM7SUFDcEIsS0FBSyxFQUFFLHFDQUFxQztJQUM1QyxXQUFXLEVBQUU7UUFDWCxjQUFjLEVBQUUsV0FBVztLQUM1QjtDQUNGLENBQUMsQ0FBQztBQUVIOztHQUVHO0FBQ0gsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDO0lBQzVCLGVBQWU7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsNENBQTRDO0FBQzVDLE9BQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQ3RELElBQUksZUFBZSxDQUFDO0lBQ2xCLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSztJQUNwQixPQUFPLEVBQUU7UUFDUCxxQkFBcUI7UUFDckIsdUNBQXVDO0tBQ3hDO0lBQ0QsU0FBUyxFQUFFO1FBQ1Qsc0ZBQXNGO0tBQ3ZGO0NBQ0YsQ0FBQyxDQUNILENBQUMifQ==