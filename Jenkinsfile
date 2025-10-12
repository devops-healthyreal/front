pipeline {
    agent any
    
    environment {
        // Docker configuration
        DOCKER_IMAGE_NAME = 'healthyreal-vue'
        DOCKERHUB_CREDENTIALS = credentials('jimin-dockerhub-credentials')
        CONTAINER_NAME = 'healthyreal-vue-dev'
        EXTERNAL_PORT = '7001'
        INTERNAL_PORT = '7001'  // Dev server port
        DOCKER_NETWORK = 'healthyreal-network'
        
        // Build configuration
        DOCKERFILE_PATH = './Dockerfile'
        BUILD_CONTEXT = '.'
        
        // Deployment configuration
        DEPLOY_SERVER = '13.124.109.82'
        DEPLOY_USER = 'ubuntu'
        DEPLOY_PATH = '/home/ubuntu/healthyreal-vue'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '======================================'
                echo 'Checking out code from GitHub...'
                echo '======================================'
                
                // 팀 서버 - release 브랜치 빌드 (테스트용)
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/release']], 
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
                
                // Display current commit info
                sh '''
                    echo "Current commit: $(git rev-parse --short HEAD)"
                    echo "Branch: release (testing)"
                    echo "Commit message: $(git log -1 --pretty=%B)"
                    echo "Repository: ${GIT_URL}"
                '''
            }
        }
        
        stage('Environment Check') {
            steps {
                echo '======================================'
                echo 'Checking environment...'
                echo '======================================'
                sh '''
                    echo "Docker version:"
                    docker --version
                    
                    echo "\nNode.js version available in build:"
                    docker run --rm node:18-alpine node --version
                    
                    echo "\nExisting containers:"
                    docker ps -a --filter name=${CONTAINER_NAME} || true
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '======================================'
                echo 'Building Docker image...'
                echo '======================================'
                script {
                    dir("${BUILD_CONTEXT}") {
                        sh """
                            docker build \
                                -t ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:latest \
                                -t ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} \
                                -t ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:\$(git rev-parse --short HEAD) \
                                -f ${DOCKERFILE_PATH} \
                                .
                        """
                    }
                }
                
                echo 'Docker image built successfully!'
                sh "docker images | grep ${DOCKER_IMAGE_NAME}"
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                echo '======================================'
                echo 'Pushing to DockerHub...'
                echo '======================================'
                script {
                    // Login to DockerHub
                    sh "echo '${DOCKERHUB_CREDENTIALS_PSW}' | docker login -u '${DOCKERHUB_CREDENTIALS_USR}' --password-stdin"
                    
                    // Push images
                    sh """
                        docker push ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:latest
                        docker push ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:\$(git rev-parse --short HEAD)
                    """
                    
                    // Logout from DockerHub
                    sh "docker logout"
                }
                
                echo 'Successfully pushed to DockerHub!'
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo '======================================'
                echo 'Stopping and removing old container...'
                echo '======================================'
                script {
                    // Stop container if running
                    sh """
                        if docker ps -q -f name=${CONTAINER_NAME}; then
                            echo "Stopping running container..."
                            docker stop ${CONTAINER_NAME} || true
                        fi
                    """
                    
                    // Remove container if exists
                    sh """
                        if docker ps -aq -f name=${CONTAINER_NAME}; then
                            echo "Removing old container..."
                            docker rm ${CONTAINER_NAME} || true
                        fi
                    """
                }
                echo 'Old container cleaned up!'
            }
        }
        
        stage('Create Docker Network') {
            steps {
                echo '======================================'
                echo 'Ensuring Docker network exists...'
                echo '======================================'
                script {
                    sh """
                        if ! docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1; then
                            echo "Creating Docker network: ${DOCKER_NETWORK}"
                            docker network create ${DOCKER_NETWORK}
                        else
                            echo "Docker network ${DOCKER_NETWORK} already exists"
                        fi
                    """
                }
            }
        }
        
        stage('Deploy Vue to Production Server') {
            steps {
                echo '======================================'
                echo 'Deploying Vue Frontend to production server...'
                echo '======================================'
                script {
                    sshagent(credentials: ['admin']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} << EOF
                                # Create directory if it doesn't exist
                                mkdir -p ${DEPLOY_PATH}
                                
                                exit
EOF
                        """
                        
                        // Copy docker-compose.yml to production server
                        sh """
                            scp -o StrictHostKeyChecking=no docker-compose.yml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/
                        """
                        
                        // Deploy Vue Frontend on production server
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} << EOF
                                cd ${DEPLOY_PATH}
                                
                                # Ensure Docker network exists (for communication with backend services)
                                docker network create healthyreal-network || true
                                
                                # Pull latest Vue image
                                docker compose pull vue-dev
                                
                                # Stop and remove old Vue container
                                docker compose stop vue-dev || true
                                docker compose rm -f vue-dev || true
                                
                                # Start new Vue container
                                docker compose up -d vue-dev
                                
                                # Wait for health check
                                echo "Waiting for Vue container to be healthy..."
                                for i in {1..30}; do
                                    if docker inspect --format="{{.State.Health.Status}}" ${CONTAINER_NAME} | grep -q "healthy"; then
                                        echo "Vue container is healthy!"
                                        break
                                    fi
                                    echo "Waiting... (\\\$i/30)"
                                    sleep 2
                                done
                                
                                # Clean up old images
                                docker image prune -f || true
                                
                                exit
EOF
                        """
                    }
                }
                
                echo 'Vue Frontend deployment completed successfully!'
            }
        }
        
        stage('Verify Vue Deployment') {
            steps {
                echo '======================================'
                echo 'Verifying Vue Frontend deployment...'
                echo '======================================'
                script {
                    sshagent(credentials: ['admin']) {
                        // Check Vue deployment on production server
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} << EOF
                                echo "Vue container status:"
                                docker ps -f name=${CONTAINER_NAME}
                                
                                echo "\\nVue container logs (last 20 lines):"
                                docker logs --tail 20 ${CONTAINER_NAME}
                                
                                echo "\\nVue container health status:"
                                docker inspect --format="{{.State.Health.Status}}" ${CONTAINER_NAME} || echo "Health check not available yet"
                                
                                echo "\\nTesting Vue health endpoint:"
                                curl -f http://localhost:${EXTERNAL_PORT}/health || echo "Vue health check failed"
                                
                                echo "\\nTesting Vue frontend:"
                                curl -f http://localhost:${EXTERNAL_PORT}/ || echo "Vue frontend not accessible"
                                
                                exit
EOF
                        """
                    }
                }
                
                echo 'Vue Frontend deployment verification completed!'
            }
        }
    }
    
    post {
        success {
            echo '======================================'
            echo '✓ Vue Frontend Deployment Successful!'
            echo '======================================'
            echo "Vue Frontend is now running on port ${EXTERNAL_PORT}"
            echo "Container: ${CONTAINER_NAME}"
            echo "Image: ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
            echo "Build: #${BUILD_NUMBER}"
            echo "Branch: main (production)"
            echo "Environment: Production Build (NGINX)"
            echo "DockerHub: ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}"
            echo "Server: ${DEPLOY_SERVER}"
            
            // Cleanup local images
            sh """
                docker rmi ${DOCKERHUB_CREDENTIALS_USR}/${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} || true
                docker image prune -f || true
            """
        }
        
        failure {
            echo '======================================'
            echo '✗ Deployment failed!'
            echo '======================================'
            echo 'Check the logs above for error details'
            
            // Print container logs if container exists on production server
            script {
                sshagent(credentials: ['admin']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} << EOF
                            if docker ps -aq -f name=${CONTAINER_NAME}; then
                                echo "Container logs:"
                                docker logs ${CONTAINER_NAME}
                            fi
                            
                            exit
EOF
                    """ || true
                }
            }
        }
        
        always {
            echo '======================================'
            echo 'Pipeline completed'
            echo '======================================'
            sh """
                echo "Build number: ${BUILD_NUMBER}"
                echo "Timestamp: \$(date)"
            echo "Environment: Production (팀 서버)"
            echo "Service: Vue Frontend Only"
            echo "Port: ${EXTERNAL_PORT} (NGINX)"
            echo "Independent Deployment: Vue frontend only"
            """
        }
    }
}

