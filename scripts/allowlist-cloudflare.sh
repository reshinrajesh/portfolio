#!/bin/bash
# Script to allowlist Cloudflare IPv4 ranges in AWS Security Group

# Usage: ./allowlist-cloudflare.sh <SECURITY_GROUP_ID>
# Example: ./allowlist-cloudflare.sh sg-0123456789abcdef

SG_ID=$1

if [ -z "$SG_ID" ]; then
    echo "Error: Security Group ID not provided."
    echo "Usage: ./allowlist-cloudflare.sh <SECURITY_GROUP_ID>"
    exit 1
fi

CF_IPS=(
    "173.245.48.0/20"
    "103.21.244.0/22"
    "103.22.200.0/22"
    "103.31.4.0/22"
    "141.101.64.0/18"
    "108.162.192.0/18"
    "190.93.240.0/20"
    "188.114.96.0/20"
    "197.234.240.0/22"
    "198.41.128.0/17"
    "162.158.0.0/15"
    "104.16.0.0/13"
    "104.24.0.0/14"
    "172.64.0.0/13"
    "131.0.72.0/22"
)

echo "Allowlisting Cloudflare IPs for Security Group: $SG_ID"

for IP in "${CF_IPS[@]}"; do
    echo "Processing $IP..."
    
    # Allow Port 80
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 80 \
        --cidr "$IP" \
        --output text > /dev/null 2>&1

    # Allow Port 443
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp \
        --port 443 \
        --cidr "$IP" \
        --output text > /dev/null 2>&1
done

echo "Done! Cloudflare IPs are now allowed on ports 80 and 443."
echo "Note: If you get 'InvalidPermission.Duplicate' errors, it means the IP was already allowlisted."
