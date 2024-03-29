import React, { Component } from 'react';
import { render } from 'react-dom';
import PDFLib from 'pdfjs-dist';

// The workerSrc property shall be specified.
PDFLib.PDFJS.workerSrc = 'dist/pdf.worker.bundle.js';

export default class PDFViewer extends Component {
  componentDidMount() {
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 1;
    this.player = this.refs.player;
    this.canvas = this.refs.canvas;

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    PDFLib.getDocument('demo.pdf').then((_pdfDoc) => {
      this.pdfDoc = _pdfDoc;
      this.refs.pageCount.textContent = this.pdfDoc.numPages;
      this.renderPage(this.pageNum);
    });

    this.refs.prev.addEventListener('click', this.onPrevPage.bind(this));
    this.refs.next.addEventListener('click', this.onNextPage.bind(this));
  }

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  renderPage(num) {
    this.pageRendering = true;
    // Using promise to fetch the page
    this.pdfDoc.getPage(num).then((page) => {
      var dpiScale = window.devicePixelRatio || 1;
      var adjustedScale = this.scale * dpiScale;

      var viewport = page.getViewport(this.scale);

      this.canvas.style.width = `${viewport.width / dpiScale}px`;
      this.canvas.style.height = `${viewport.height / dpiScale}px`;

      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderTask = page.render({
        canvasContext: this.canvas.getContext('2d'),
        viewport: viewport
      });

      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          // New page rendering is pending
          renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
      });
    });

    // Update page counters
    this.refs.pageNumber.textContent = this.pageNum;
  }

  /**
   * Displays previous page.
   */
  onPrevPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Displays next page.
   */
  onNextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  queueRenderPage(num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }

  render() {
    return (
      <div ref="player" className="player">
        <canvas ref="canvas" className="player-canvas"></canvas>
        <div className="player-controls">
          <button className="player-arrow" ref="prev">◀</button>
          <span ref="pageNumber">0</span> of <span ref="pageCount">0</span>
          <button className="player-arrow" ref="next">▶</button>
        </div>
      </div>
    );
  }
}

render(<PDFViewer />, document.getElementById('player'));
