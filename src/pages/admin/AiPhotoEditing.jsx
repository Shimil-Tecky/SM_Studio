import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Sliders, Layers, Users, RefreshCw, Scissors, Heart, Image as ImageIcon } from 'lucide-react';

export default function AiPhotoEditing() {
  const [activeTab, setActiveTab] = useState('enhancer'); // enhancer, background, faceRecognition
  
  // Enhancer Slider States
  const [exposure, setExposure] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [skinRetouch, setSkinRetouch] = useState(0);
  const [hdr, setHdr] = useState(0);

  // Background States
  const [bgBlur, setBgBlur] = useState(0);
  const [bgRemoved, setBgRemoved] = useState(false);
  const [bgType, setBgType] = useState('original'); // original, studio, outdoor

  // Compare Slider Position
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDragging = useRef(false);
  const sliderContainerRef = useRef(null);

  // Batch states
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // Sample Image
  const sampleBeforeUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"; // raw wedding portrait

  // Drag handlers for comparison slider
  const handleMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  // Preset Applicator
  const applyPreset = (presetName) => {
    switch (presetName) {
      case 'warm':
        setExposure(105);
        setContrast(110);
        setSaturation(115);
        setSharpness(120);
        setSkinRetouch(40);
        setHdr(20);
        break;
      case 'cinematic':
        setExposure(95);
        setContrast(130);
        setSaturation(85);
        setSharpness(130);
        setSkinRetouch(20);
        setHdr(50);
        break;
      case 'golden':
        setExposure(110);
        setContrast(105);
        setSaturation(130);
        setSharpness(110);
        setSkinRetouch(50);
        setHdr(40);
        break;
      case 'luxury':
        setExposure(100);
        setContrast(120);
        setSaturation(90);
        setSharpness(140);
        setSkinRetouch(70);
        setHdr(30);
        break;
      case 'reset':
      default:
        setExposure(100);
        setContrast(100);
        setSaturation(100);
        setSharpness(100);
        setSkinRetouch(0);
        setHdr(0);
    }
  };

  // Run simulated batch processing
  const startBatchProcess = () => {
    setBatchProcessing(true);
    setBatchProgress(0);

    const interval = setInterval(() => {
      setBatchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBatchProcessing(false);
          alert('Batch processing complete! 124 photos in queue have been enhanced with active Wedding Presets and exported.');
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // CSS Filter compiler for active editor preview
  const getFilterStyle = () => {
    let brightness = exposure / 100;
    let contr = contrast / 100;
    let sat = saturation / 100;
    let blurValue = bgBlur > 0 ? `blur(${bgBlur / 4}px)` : '';
    
    // Simulating sharpness and skin retouch through CSS filters
    let contrastExtra = skinRetouch > 0 ? `contrast(${1 - skinRetouch/400}) saturate(${1 + skinRetouch/600})` : '';
    let hdrExtra = hdr > 0 ? `contrast(${1 + hdr/200}) saturate(${1 + hdr/300}) brightness(${1 - hdr/400})` : '';

    return {
      filter: `brightness(${brightness}) contrast(${contr}) saturate(${sat}) ${blurValue} ${contrastExtra} ${hdrExtra}`
    };
  };

  // Mock face recognition group listing
  const faceGroups = [
    { title: 'Bride (Isabella)', count: 24, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150' },
    { title: 'Groom (Alexander)', count: 18, url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150' },
    { title: 'Family Groups', count: 12, url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=150' },
    { title: 'Unassigned Guests', count: 68, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=150' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Neural Photo Processing
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>AI Photo Editing</h2>
        </div>
        <button 
          onClick={startBatchProcess}
          className="btn btn-gold" 
          disabled={batchProcessing}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={14} className={batchProcessing ? "animate-pulse-gold" : ""} />
          <span>Batch Process Queue (124)</span>
        </button>
      </div>

      {/* Batch progress bar */}
      {batchProcessing && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', border: '1px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Processing batch queue using Neural Retouching Engine...</span>
            <span style={{ color: 'var(--gold-primary)', fontWeight: '700' }}>{batchProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${batchProgress}%`, height: '100%', background: 'var(--gold-gradient)' }}></div>
          </div>
        </div>
      )}

      {/* Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr',
        gap: '2rem'
      }} className="editor-grid">
        
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 991px) {
            .editor-grid { grid-template-columns: 1fr !important; }
          }
        `}} />

        {/* Left Column: Visual Editor Comparison Viewport */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Sub Navigation tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setActiveTab('enhancer')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === 'enhancer' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'enhancer' ? '#fff' : 'var(--text-secondary)',
                paddingBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '600'
              }}
            >
              One-Click Enhancer
            </button>
            <button 
              onClick={() => setActiveTab('background')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === 'background' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'background' ? '#fff' : 'var(--text-secondary)',
                paddingBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '600'
              }}
            >
              Background Tools
            </button>
            <button 
              onClick={() => setActiveTab('faceRecognition')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === 'faceRecognition' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'faceRecognition' ? '#fff' : 'var(--text-secondary)',
                paddingBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '600'
              }}
            >
              AI Face Recognition
            </button>
          </div>

          {/* Interactive Comparison Viewport */}
          {activeTab !== 'faceRecognition' ? (
            <div 
              ref={sliderContainerRef}
              className="comparison-slider-container"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After image (Enhanced with filters) */}
              <div 
                className="comparison-image"
                style={{
                  backgroundImage: `url(${sampleBeforeUrl})`,
                  ...getFilterStyle()
                }}
              ></div>

              {/* Background Removal Simulation */}
              {bgRemoved && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#0a0a0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  backgroundImage: bgType === 'studio' 
                    ? 'linear-gradient(135deg, #1f1f1f 0%, #0d0d0d 100%)' 
                    : bgType === 'outdoor' 
                    ? 'url(https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800)'
                    : 'none',
                  backgroundSize: 'cover'
                }}>
                  <div style={{ 
                    width: '320px', 
                    height: '320px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    border: '3px solid var(--gold-primary)',
                    boxShadow: 'var(--gold-glow)'
                  }}>
                    <img src={sampleBeforeUrl} alt="Face Extract" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, fontSize: '0.8rem', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.2rem 0.6rem', color: 'var(--gold-primary)', borderRadius: '4px' }}>
                    Background Extracted
                  </span>
                </div>
              )}

              {/* Before image (original clip width container) */}
              <div 
                className="comparison-image"
                style={{
                  backgroundImage: `url(${sampleBeforeUrl})`,
                  width: `${sliderPosition}%`,
                  zIndex: 10,
                  borderRight: '1px solid rgba(255,255,255,0.1)'
                }}
              ></div>

              {/* Drag Handle */}
              <div 
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={() => { isDragging.current = true; }}
                onTouchStart={() => { isDragging.current = true; }}
              >
                <div className="slider-button">
                  ↔
                </div>
              </div>

              {/* Indicators */}
              <div style={{ position: 'absolute', bottom: '15px', left: '15px', zIndex: 15, fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.3rem 0.8rem', borderRadius: '4px' }}>
                Before
              </div>
              <div style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 15, fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.3rem 0.8rem', borderRadius: '4px', color: 'var(--gold-primary)' }}>
                AI Enhanced
              </div>
            </div>
          ) : (
            /* Face Recognition Tab view */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Neural clusters have grouped the uploaded gallery photos by detecting facial profiles. Click on a profile folder to index and tag matching portraits:
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem'
              }}>
                {faceGroups.map((group, idx) => (
                  <div key={idx} className="glass-panel" style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(13,13,13,0.3)',
                    cursor: 'pointer'
                  }}>
                    <img 
                      src={group.url} 
                      alt={group.title} 
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--gold-secondary)',
                        marginInline: 'auto',
                        marginBottom: '1rem'
                      }}
                    />
                    <h4 style={{ color: '#fff', fontSize: '1rem' }}>{group.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600' }}>
                      {group.count} Photo Matches
                    </span>
                    <button 
                      className="btn btn-dark" 
                      style={{ width: '100%', marginTop: '1rem', padding: '0.4rem', fontSize: '0.7rem' }}
                      onClick={() => alert(`Running AI auto-tag rules on ${group.title} cluster: matching tags added.`)}
                    >
                      Auto-Tag Matches
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls Editor panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Preset Picker */}
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--gold-primary)" />
              <span>Wedding Presets</span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button onClick={() => applyPreset('warm')} className="btn btn-dark" style={{ padding: '0.5rem', fontSize: '0.75rem', textTransform: 'none' }}>
                Warm Wedding Tone
              </button>
              <button onClick={() => applyPreset('cinematic')} className="btn btn-dark" style={{ padding: '0.5rem', fontSize: '0.75rem', textTransform: 'none' }}>
                Cinematic Look
              </button>
              <button onClick={() => applyPreset('golden')} className="btn btn-dark" style={{ padding: '0.5rem', fontSize: '0.75rem', textTransform: 'none' }}>
                Golden Hour Effect
              </button>
              <button onClick={() => applyPreset('luxury')} className="btn btn-dark" style={{ padding: '0.5rem', fontSize: '0.75rem', textTransform: 'none' }}>
                Luxury Film Style
              </button>
            </div>
            <button 
              onClick={() => applyPreset('reset')} 
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: '1rem', padding: '0.4rem', fontSize: '0.75rem' }}
            >
              Reset to Original
            </button>
          </div>

          {/* Enhancement Sliders */}
          {activeTab === 'enhancer' && (
            <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sliders size={16} color="var(--gold-primary)" />
                <span>Manual Adjustments</span>
              </h3>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.25rem' }}>
                  <span>Exposure Correction</span>
                  <span>{exposure}%</span>
                </div>
                <input 
                  type="range" min="50" max="150" value={exposure} 
                  onChange={(e) => setExposure(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.25rem' }}>
                  <span>Contrast Curve</span>
                  <span>{contrast}%</span>
                </div>
                <input 
                  type="range" min="50" max="150" value={contrast} 
                  onChange={(e) => setContrast(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.25rem' }}>
                  <span>Saturations</span>
                  <span>{saturation}%</span>
                </div>
                <input 
                  type="range" min="0" max="200" value={saturation} 
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.25rem' }}>
                  <span>Skin Retouching</span>
                  <span>{skinRetouch}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={skinRetouch} 
                  onChange={(e) => setSkinRetouch(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.25rem' }}>
                  <span>HDR Contrast Booster</span>
                  <span>{hdr}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={hdr} 
                  onChange={(e) => setHdr(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                />
              </div>
            </div>
          )}

          {/* Background Tools controls */}
          {activeTab === 'background' && (
            <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="var(--gold-primary)" />
                <span>Background Extractor</span>
              </h3>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.25rem' }}>
                  <span>Depth Lens Blur</span>
                  <span>{bgBlur}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={bgBlur} 
                  onChange={(e) => setBgBlur(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                  disabled={bgRemoved}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={bgRemoved} 
                    onChange={(e) => {
                      setBgRemoved(e.target.checked);
                      if (e.target.checked) setBgBlur(0);
                    }}
                    style={{ accentColor: 'var(--gold-primary)' }}
                  />
                  <span>Extract Face & Remove Background</span>
                </label>

                {bgRemoved && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>Replace Background With:</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        onClick={() => setBgType('original')} 
                        className="btn btn-dark" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: bgType === 'original' ? '1px solid var(--gold-primary)' : '1px solid transparent' }}
                      >
                        Transparency
                      </button>
                      <button 
                        onClick={() => setBgType('studio')} 
                        className="btn btn-dark" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: bgType === 'studio' ? '1px solid var(--gold-primary)' : '1px solid transparent' }}
                      >
                        Luxury Gray Gradient
                      </button>
                      <button 
                        onClick={() => setBgType('outdoor')} 
                        className="btn btn-dark" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: bgType === 'outdoor' ? '1px solid var(--gold-primary)' : '1px solid transparent' }}
                      >
                        Outdoor Bokeh
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
