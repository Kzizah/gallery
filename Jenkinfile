pipeline {
    agent any
    
    environment {
        RENDER_APP_NAME = 'gallery' // Replace with your Render application name
        SLACK_CHANNEL = 'project' // Replace with your Slack channel
        SLACK_CREDENTIALS_ID = 'SLACK-TOKEN-API' // Ensure this matches your Jenkins credentials ID
        EMAIL_RECIPIENT = 'silateizizah@gmail.com' // Replace with your email recipient or ensure it's set in Jenkins
    }
    
    tools {
        nodejs "NodeJS-22.3.0"  // Use the NodeJS tool defined in Jenkins
    }
    
    triggers {
        pollSCM('H/2 * * * *') // Polls the SCM every 2 minutes
    }
    
    stages {
        stage("Clone gallery repository") {
            steps {
                git branch: 'master', url: 'https://github.com/Kzizah/gallery'
            }
        }
        
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Install mocha and chai') {
            steps {
                echo 'Installing other dependencies...'
                sh 'npm install --save-dev mocha chai chai-http'
            }
        }
        
        stage('Test project') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Build project') {
            steps {
                echo 'Building...'
                sh 'npm run build'
            }
        }
        
        stage('Start server') {
            steps {
                echo 'Starting server...'
                sh 'npm start &'
                sleep 10 // Give time for the server to start
            }
        }
        
        stage('Deploy to Render') {
            steps {
                script {
                    // Use credentials binding for RENDER_API_KEY
                    withCredentials([string(credentialsId: 'render_api_key', variable: 'RENDER_API_KEY')]) {
                        sh "curl -X POST -H 'Authorization: Bearer \${RENDER_API_KEY}' \
                            -H 'Content-Type: application/json' \
                            -d '{\"branch\": \"master\", \"env\": {\"NODE_ENV\": \"production\"}}' \
                            https://api.render.com/v1/services/${RENDER_APP_NAME}/deploy"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo 'Deployment to Render succeeded!'
                echo 'SlackBot success message'
                slackSend (
                    channel: "${SLACK_CHANNEL}", 
                    color: 'good', 
                    message: "Build succeeded: ${env.JOB_NAME} ${env.BUILD_NUMBER}. Access app on https://gallery-v5aa.onrender.com/"
                )
            }
        }
        failure {
            script {
                echo 'Deployment to Render failed!'
                echo 'SlackBot failed message'
                slackSend (
                    channel: "${SLACK_CHANNEL}", 
                    color: 'danger', 
                    message: "Build failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
                )
            }
        }
        always {
            script {
                if (currentBuild.result == 'FAILURE') {
                    emailext (
                        to: "${EMAIL_RECIPIENT}",
                        subject: "Jenkins Build Failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}",
                        body: """
                        <p>The Jenkins build <b>${env.JOB_NAME} ${env.BUILD_NUMBER}</b> has failed.</p>
                        <p>Please check the Jenkins console output for more details: ${env.BUILD_URL}</p>
                        """
                    )
                }
            }
        }
    }
}
