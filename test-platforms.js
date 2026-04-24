// Test script to verify platform detection functionality

// Platform detection function (copied from index.js for testing)
function detectPlatform(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            return 'YouTube';
        } else if (hostname.includes('instagram.com')) {
            return 'Instagram';
        } else if (hostname.includes('tiktok.com') || hostname.includes('tiktokcdn.com')) {
            return 'TikTok';
        } else if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
            return 'Facebook';
        } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            return 'Twitter/X';
        } else if (hostname.includes('reddit.com')) {
            return 'Reddit';
        } else if (hostname.includes('vimeo.com')) {
            return 'Vimeo';
        } else if (hostname.includes('twitch.tv')) {
            return 'Twitch';
        } else if (hostname.includes('soundcloud.com')) {
            return 'SoundCloud';
        }
        return 'Unknown';
    } catch (e) {
        return 'Invalid';
    }
}

// Test URLs for different platforms
const testUrls = [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: 'YouTube' },
    { url: 'https://youtu.be/dQw4w9WgXcQ', expected: 'YouTube' },
    { url: 'https://www.instagram.com/p/C1234567890/', expected: 'Instagram' },
    { url: 'https://www.tiktok.com/@user/video/1234567890123456789', expected: 'TikTok' },
    { url: 'https://www.facebook.com/share/v/1KT82FERZ3/', expected: 'Facebook' },
    { url: 'https://twitter.com/user/status/1234567890', expected: 'Twitter/X' },
    { url: 'https://x.com/user/status/1234567890', expected: 'Twitter/X' },
    { url: 'https://www.reddit.com/r/videos/comments/abc123/test/', expected: 'Reddit' },
    { url: 'https://vimeo.com/123456789', expected: 'Vimeo' },
    { url: 'https://www.twitch.tv/videos/123456789', expected: 'Twitch' },
    { url: 'https://soundcloud.com/user/track-name', expected: 'SoundCloud' },
    { url: 'https://example.com/video', expected: 'Unknown' },
    { url: 'not-a-url', expected: 'Invalid' }
];

console.log('🧪 Testing Platform Detection\n');

let passed = 0;
let failed = 0;

testUrls.forEach(test => {
    const result = detectPlatform(test.url);
    const status = result === test.expected ? '✅' : '❌';
    
    console.log(`${status} ${test.url}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got: ${result}`);
    
    if (result === test.expected) {
        passed++;
    } else {
        failed++;
    }
    console.log('');
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('🎉 All tests passed! Platform detection is working correctly.');
} else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
}
