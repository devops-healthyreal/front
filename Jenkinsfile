pipeline {
    agent any
    
    environment {
        // Docker configuration
        DOCKER_IMAGE_NAME = 'healthyreal-vue'
        CONTAINER_NAME = 'healthyreal-vue-container'
        PORT = '7001'
        DOCKER_NETWORK = 'healthyreal-network'
        
        // Build configuration
        DOCKERFILE_PATH = './Dockerfile'
        BUILD_CONTEXT = '.'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '======================================'
                echo 'Checking out code from GitHub...'
                echo '======================================'
                
                // ===== 브랜치 설정 =====
                // 연습용 (개인 서버 - 현재 사용)
                checkout scm
                
                // 실전용 (팀 서버 - 나중에 사용)
                // checkout([$class: 'GitSCM', 
                //     branches: [[name: '*/main']], 
                //     userRemoteConfigs: scm.userRemoteConfigs
                // ])
                
                // Display current commit info
                sh '''
                    echo "Current commit: $(git rev-parse --short HEAD)"
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit message: $(git log -1 --pretty=%B)"
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
                                -t ${DOCKER_IMAGE_NAME}:latest \
                                -t ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} \
                                -f ${DOCKERFILE_PATH} \
                                .
                        """
                    }
                }
                
                echo 'Docker image built successfully!'
                sh "docker images | grep ${DOCKER_IMAGE_NAME}"
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
        
        stage('Run New Container') {
            steps {
                echo '======================================'
                echo 'Starting new container...'
                echo '======================================'
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --network ${DOCKER_NETWORK} \
                        -p ${PORT}:${PORT} \
                        --restart unless-stopped \
                        --health-cmd="wget --quiet --tries=1 --spider http://15.164.146.96:${PORT}/ || exit 1" \
                        --health-interval=30s \
                        --health-timeout=3s \
                        --health-start-period=40s \
                        --health-retries=3 \
                        ${DOCKER_IMAGE_NAME}:latest
                """
                
                echo 'Container started! Waiting for health check...'
                sh """
                    for i in {1..30}; do
                        if docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} | grep -q 'healthy'; then
                            echo "Container is healthy!"
                            exit 0
                        fi
                        echo "Waiting for container to be healthy... (\$i/30)"
                        sleep 2
                    done
                    echo "Container health check timeout - but container is running"
                """
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '======================================'
                echo 'Verifying deployment...'
                echo '======================================'
                sh """
                    echo "Container status:"
                    docker ps -f name=${CONTAINER_NAME}
                    
                    echo "\nContainer logs (last 20 lines):"
                    docker logs --tail 20 ${CONTAINER_NAME}
                    
                    echo "\nContainer health status:"
                    docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} || echo "Health check not available yet"
                """
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                echo '======================================'
                echo 'Cleaning up old Docker images...'
                echo '======================================'
                script {
                    // Keep last 3 builds, remove older ones
                    sh """
                        echo "Current images:"
                        docker images ${DOCKER_IMAGE_NAME}
                        
                        echo "\nRemoving dangling images..."
                        docker image prune -f || true
                        
                        echo "\nRemoving old tagged images (keeping last 3)..."
                        docker images ${DOCKER_IMAGE_NAME} --format "{{.Tag}}" | \
                            grep -E '^[0-9]+\$' | \
                            sort -rn | \
                            tail -n +4 | \
                            xargs -r -I {} docker rmi ${DOCKER_IMAGE_NAME}:{} || true
                        
                        echo "\nRemaining images:"
                        docker images ${DOCKER_IMAGE_NAME}
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '======================================'
            echo '✓ Deployment successful! (Practice Environment)'
            echo '======================================'
            echo "Vue Frontend is now running on port ${PORT}"
            echo "Container: ${CONTAINER_NAME}"
            echo "Image: ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
            echo "Build: #${BUILD_NUMBER}"
            echo "Branch: release (연습용)"
        }
        
        failure {
            echo '======================================'
            echo '✗ Deployment failed!'
            echo '======================================'
            echo 'Check the logs above for error details'
            
            // Print container logs if container exists
            sh """
                if docker ps -aq -f name=${CONTAINER_NAME}; then
                    echo "\nContainer logs:"
                    docker logs ${CONTAINER_NAME}
                fi
            """ 
        }
        
        always {
            echo '======================================'
            echo 'Pipeline completed'
            echo '======================================'
            sh """
                echo "Build number: ${BUILD_NUMBER}"
                echo "Timestamp: \$(date)"
                echo "Environment: Practice (개인 서버)"
            """
        }
    }
}

